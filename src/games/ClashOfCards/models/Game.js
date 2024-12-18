import { GameConfig } from "../constants/gameConfig.js";
import { Round } from "./Round.js";
import { getRandomCard } from "../data/cards.js";
import { logger } from "../../../utils/logger.js";

export class Game {
  constructor(channelId) {
    this.channelId = channelId;
    this.players = new Map();
    this.isStarted = false;
    this.currentTurn = null;
    this.currentRound = null;
    this.playerOrder = [];
    this.RoundEffects = [];
    logger.debug("Game instance created", { channelId });
  }

  addPlayer(player) {
    if (this.isStarted || this.players.size >= GameConfig.MAX_PLAYERS) {
      logger.debug("Failed to add player", {
        isStarted: this.isStarted,
        currentPlayers: this.players.size,
        maxPlayers: GameConfig.MAX_PLAYERS,
      });
      return false;
    }
    this.players.set(player.user.id, player);
    logger.debug("Player added to game", {
      playerId: player.user.id,
      playerCount: this.players.size,
    });
    return true;
  }

  startGame() {
    if (this.players.size < GameConfig.MIN_PLAYERS || this.isStarted) {
      logger.debug("Cannot start game", {
        playerCount: this.players.size,
        minPlayers: GameConfig.MIN_PLAYERS,
        isStarted: this.isStarted,
      });
      return false;
    }

    // Deal initial cards
    for (const player of this.players.values()) {
      for (let i = 0; i < GameConfig.HAND_SIZE; i++) {
        const card = getRandomCard();
        player.drawCard(card);
        logger.debug("Dealt card to player", {
          playerId: player.user.id,
          cardName: card.name,
          handSize: player.hand.length,
        });
      }
    }

    // Set up player order
    this.playerOrder = Array.from(this.players.keys());
    this.shufflePlayers();

    // Start game
    this.isStarted = true;
    this.currentTurn = this.playerOrder[0];
    this.currentRound = new Round();

    logger.info("Game started", {
      channelId: this.channelId,
      playerCount: this.players.size,
      firstPlayer: this.currentTurn,
    });

    return true;
  }

  playCard(player, cardIndex) {
    if (
      !this.isStarted ||
      !player.isAlive ||
      this.currentTurn !== player.user.id
    ) {
      logger.error("Invalid play attempt", {
        isStarted: this.isStarted,
        playerAlive: player.isAlive,
        currentTurn: this.currentTurn,
        playerId: player.user.id,
      });
      throw new Error("Invalid play attempt!");
    }

    const card = player.hand[cardIndex];
    if (!card) {
      logger.error("Invalid card index", {
        cardIndex,
        handSize: player.hand.length,
      });
      throw new Error("Invalid card index!");
    }

    // Remove the card first
    player.removeCard(cardIndex);
    logger.debug("Card removed from hand", {
      playerId: player.user.id,
      cardName: card.name,
      remainingCards: player.hand.length,
    });

    // Get next player automatically
    const nextPlayer = this.getNextAlivePlayer(player.user.id);
    if (!nextPlayer) {
      logger.error("No valid target available");
      throw new Error("No valid target available!");
    }

    // Add Round Effects in cards effects
    if (this.RoundEffects.length > 0) {
      card.effects = [...this.RoundEffects, ...card.effects];
      this.RoundEffects = [];
    }

    const result = this.applyCardEffects(card, player, nextPlayer);

    // Draw a new card automatically
    const newCard = getRandomCard();
    if (newCard) {
      player.drawCard(newCard);
      logger.debug("Drew new card", {
        playerId: player.user.id,
        cardName: newCard.name,
        handSize: player.hand.length,
      });
    }

    // Move to next turn
    const nextTurn = this.nextTurn();
    logger.debug("Next turn", { currentTurn: nextTurn });

    // Check if game is over
    if (this.checkGameOver()) {
      const winner = this.getWinner();
      logger.info("Game over", {
        winner: winner.user.id,
        finalHealth: winner.health,
      });
      return { ...result, gameOver: true, winner };
    }

    return { ...result, gameOver: false, nextPlayer, nextTurn };
  }

  applyCardEffects(card, player, target) {
    logger.debug("Applying card effects", {
      cardName: card.name,
      playerId: player.user.id,
      targetId: target.user.id,
    });

    let message = `${player.user.username} played ${card.name}!`;

    for (const effect of card.effects) {
      switch (effect.type) {
        case "DAMAGE":
          const damage = target.takeDamage(
            player.calculateBoostedDamage(effect.value)
          );
          // has immunity active
          if (damage?.immunity) {
            message += `\n🛡️ ${target.user.username} blocked all damage with IMMUNITY!`;
          }
          // has reflect
          else if (damage?.reflect) {
            const damageToPlayer = player.takeDamage(effect.value, ["REFLECT"]);
            // if player also had immunity
            if (damageToPlayer?.immunity) {
              message += `\n🛡️ ${player.user.username} blocked all reflected damage with IMMUNITY!`;
            }
            // if no immunity
            else {
              message += `\n🛡️🗡️ ${target.user.username} reflected ${damageToPlayer.damage} damage back to ${player.user.username}!`;
            }
          } else {
            message += `\n🗡️ Dealt ${damage.damage} damage to ${target.user.username}!`;
            logger.debug("Applied damage effect", {
              damage,
              targetHealth: target.health,
            });
          }
          break;

        case "HEAL":
          const healing = player.heal(effect.value);
          message += `\n💚 Healed for ${healing} HP!`;
          logger.debug("Applied healing effect", {
            healing,
            playerHealth: player.health,
          });
          break;

        case "WEAKEN":
          target.addEffect("WEAKENED", effect.value);
          message += `\n🔱 Weakened ${target.user.username}'s next attack!`;
          logger.debug("Applied weaken effect", {
            value: effect.value,
            target: target.user.id,
          });
          break;

        case "SWAP_HEALTH":
          const playersHealth = player.swapHealth(target.health);
          const targetHealth = target.swapHealth(playersHealth.oldHealth);
          message += `\n🔄 Swapped health! ${player.user.username} now has ${playersHealth.updatedHealth} health, while ${target.user.username} now has ${targetHealth.updatedHealth} health.`;
          logger.debug("Applied swapHealth effect", {
            value: effect.value,
            target: target.user.id,
          });
          break;

        case "SELF_DAMAGE":
          const selfDamageResult = player.takeDamage(effect.value);
          message += `\n🗡️ Dealt ${selfDamageResult.damage} damage to yourself!`;
          logger.debug("Applied Self damage effect", {
            damage: selfDamageResult.damage,
            targetHealth: target.health,
          });
          break;

        case "JUDGMENT":
          if (target.health > effect.above || target.health < effect.below) {
            target.swapHealth(0);
            message += `\n⚖️ ${target.user.username} was judged unworthy and defeated instantly!`;
            logger.debug("Judgment effect applied", {
              targetId: target.user.id,
              newHealth: target.health,
            });
          } else {
            message += `\n⚖️ ${target.user.username} survived the judgment!`;
            logger.debug("Judgment effect didnt applied", {
              targetId: target.user.id,
              targetHealth: target.health,
            });
          }
          break;

        case "DRAIN":
          const drainResult = target.takeDamage(effect.value);
          if (drainResult?.immunity) {
            message += `\n🛡️ ${target.user.username} blocked the drain with IMMUNITY!`;
          } else if (drainResult?.reflect) {
            const reflectDamage = player.takeDamage(effect.value, ["REFLECT"]);
            message += `\n🛡️🗡️ ${target.user.username} reflected the drain back to ${player.user.username} for ${reflectDamage.damage} damage!`;
          } else {
            const healthRestored = player.heal(drainResult.damage);
            message += `\n🌙 Drained ${drainResult.damage} health from ${target.user.username}, restoring ${healthRestored} health to yourself!`;
          }
          logger.debug("Drain effect applied", {
            drainResult,
            targetId: target.user.id,
            targetHealth: target.health,
            playerId: player.user.id,
            playerHealth: player.health,
          });
          break;

        case "MASS_DAMAGE":
          let totalMassDamage = 0;
          for (const p of this.players.values()) {
            if (
              p.isAlive &&
              !(
                (effect?.exclude === "player" &&
                  p.user.id === player.user.id) ||
                (effect?.exclude === "target" && p.user.id === target.user.id)
              )
            ) {
              const damageResult = p.takeDamage(effect.value);
              totalMassDamage += damageResult.damage;
              logger.debug("Mass damage applied", {
                playerId: p.user.id,
                damageDealt: damageResult.damage,
                remainingHealth: p.health,
              });
            }
          }

          const excludeText =
            effect?.exclude === "player"
              ? ` except ${player.user.username}`
              : effect?.exclude === "target"
              ? ` except ${target.user.username}`
              : "";

          message += `\n🔥 Mass Damage dealt ${effect.value} damage to all players${excludeText}! (Total damage: ${totalMassDamage})`;
          break;

        case "MASS_HEAL":
          for (const p of this.players.values()) {
            if (p.isAlive) {
              const healedAmount = p.heal(effect.value);
              logger.debug("Mass heal applied", {
                playerId: p.user.id,
                healedAmount,
                newHealth: p.health,
              });
            }
          }
          message += `\n✨ Mass Heal restored ${effect.value} HP to all players!`;
          break;

        case "DISABLE_HEALING":
          target.addEffect(effect.type);
          break;

        case "IMMUNITY":
        case "REFLECT":
          player.addEffect(effect.type);
          break;

        case "MULTI_TARGET":
          if (effect?.DamageNextRound) {
            //  add to round effects
            this.RoundEffects.push({
              type: effect.type,
              value: effect.value,
              damageReason: effect.damageReason.replace(
                "{playerName}",
                `${player.user.username}'s`
              ),
            });
          } else {
            const damageResult = target.takeDamage(effect.value);
            message += `\n🔥 ${effect.damageReason
              .replace("{target}", target.user.username)
              .replace("{damage}", damageResult.damage)}!`;

            logger.debug("Multi Target Damaged applied", {
              playerId: target.id,
              damageDealt: damageResult.damage,
              newHealth: target.health,
            });
          }
          break;

        case "EXTRA_TURN":
          player.addEffect("EXTRA_TURN");
          message += `\n⚡ ${player.user.username} will get an extra turn immediately after their current turn!`;
          logger.debug("Extra turn granted", {
            playerId: player.user.id,
            currentTurn: this.currentTurn,
          });
          break;

        case "BOOST_NEXT":
          if (effect.boost === "ATTACK") {
            player.addEffect("BOOST_DAMAGE", effect.value);
            message += `\n💫 ${player.user.username}'s next attack will be boosted by ${effect.value} damage!`;
          } else if (effect.boost === "HEALING") {
            player.addEffect("BOOST_HEALING", effect.value);
            message += `\n💫 ${player.user.username}'s next heal will be boosted by ${effect.value}%!`;
          }
          logger.debug("Boost effect applied", {
            playerId: player.user.id,
            boostType: effect.boost,
            value: effect.value,
          });
          break;

        default:
          logger.debug("Unknown effect type", { type: effect.type });
          break;
      }
    }

    return { success: true, message };
  }

  nextTurn() {
    const currentPlayer = this.players.get(this.currentTurn);

    if (currentPlayer.hasEffect("EXTRA_TURN")) {
      currentPlayer.removeEffect("EXTRA_TURN");
      logger.debug("Extra turn activated", { playerId: currentPlayer.user.id });
      return this.currentTurn;
    }

    const currentIndex = this.playerOrder.indexOf(this.currentTurn);
    let nextIndex = (currentIndex + 1) % this.playerOrder.length;

    while (!this.players.get(this.playerOrder[nextIndex]).isAlive) {
      nextIndex = (nextIndex + 1) % this.playerOrder.length;
      if (nextIndex === currentIndex) break;
    }

    this.currentTurn = this.playerOrder[nextIndex];
    return this.currentTurn;
  }

  getNextAlivePlayer(currentPlayerId) {
    const currentIndex = this.playerOrder.indexOf(currentPlayerId);
    let nextIndex = (currentIndex + 1) % this.playerOrder.length;

    while (!this.players.get(this.playerOrder[nextIndex]).isAlive) {
      nextIndex = (nextIndex + 1) % this.playerOrder.length;
      if (nextIndex === currentIndex) return null;
    }

    return this.players.get(this.playerOrder[nextIndex]);
  }

  checkGameOver() {
    const alivePlayers = Array.from(this.players.values()).filter(
      (p) => p.isAlive
    );
    return alivePlayers.length <= 1;
  }

  getWinner() {
    return Array.from(this.players.values()).find((p) => p.isAlive);
  }

  shufflePlayers() {
    for (let i = this.playerOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.playerOrder[i], this.playerOrder[j]] = [
        this.playerOrder[j],
        this.playerOrder[i],
      ];
    }
    logger.debug("Shuffled player order", { playerOrder: this.playerOrder });
  }
}
