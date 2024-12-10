import { GameConfig } from '../constants/gameConfig.js';
import { Player } from './Player.js';
import { Round } from './Round.js';
import { getRandomCard } from '../data/cards.js';
import { logger } from '../../../utils/logger.js';

export class Game {
  constructor(channelId) {
    this.channelId = channelId;
    this.players = new Map();
    this.isStarted = false;
    this.currentTurn = null;
    this.currentRound = null;
    this.playerOrder = [];
    logger.debug('Game instance created', { channelId });
  }

  addPlayer(player) {
    if (this.isStarted || this.players.size >= GameConfig.MAX_PLAYERS) {
      logger.debug('Failed to add player', {
        isStarted: this.isStarted,
        currentPlayers: this.players.size,
        maxPlayers: GameConfig.MAX_PLAYERS
      });
      return false;
    }
    this.players.set(player.user.id, player);
    logger.debug('Player added to game', {
      playerId: player.user.id,
      playerCount: this.players.size
    });
    return true;
  }

  startGame() {
    if (this.players.size < GameConfig.MIN_PLAYERS || this.isStarted) {
      logger.debug('Cannot start game', {
        playerCount: this.players.size,
        minPlayers: GameConfig.MIN_PLAYERS,
        isStarted: this.isStarted
      });
      return false;
    }

    // Deal initial cards
    for (const player of this.players.values()) {
      for (let i = 0; i < GameConfig.HAND_SIZE; i++) {
        const card = getRandomCard();
        player.drawCard(card);
        logger.debug('Dealt card to player', {
          playerId: player.user.id,
          cardName: card.name,
          handSize: player.hand.length
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

    logger.info('Game started', {
      channelId: this.channelId,
      playerCount: this.players.size,
      firstPlayer: this.currentTurn
    });

    return true;
  }

  playCard(player, cardIndex) {
    if (!this.isStarted || !player.isAlive || this.currentTurn !== player.user.id) {
      logger.error('Invalid play attempt', {
        isStarted: this.isStarted,
        playerAlive: player.isAlive,
        currentTurn: this.currentTurn,
        playerId: player.user.id
      });
      throw new Error('Invalid play attempt!');
    }

    const card = player.hand[cardIndex];
    if (!card) {
      logger.error('Invalid card index', { cardIndex, handSize: player.hand.length });
      throw new Error('Invalid card index!');
    }

    // Remove the card first
    player.removeCard(cardIndex);
    logger.debug('Card removed from hand', {
      playerId: player.user.id,
      cardName: card.name,
      remainingCards: player.hand.length
    });

    // Get next player automatically
    const nextPlayer = this.getNextAlivePlayer(player.user.id);
    if (!nextPlayer) {
      logger.error('No valid target available');
      throw new Error('No valid target available!');
    }

    // Apply card effects
    const result = this.applyCardEffects(card, player, nextPlayer);

    // Draw a new card automatically
    const newCard = getRandomCard();
    if (newCard) {
      player.drawCard(newCard);
      logger.debug('Drew new card', {
        playerId: player.user.id,
        cardName: newCard.name,
        handSize: player.hand.length
      });
    }

    // Move to next turn
    const nextTurn = this.nextTurn();
    logger.debug('Next turn', { currentTurn: nextTurn });

    // Check if game is over
    if (this.checkGameOver()) {
      const winner = this.getWinner();
      logger.info('Game over', {
        winner: winner.user.id,
        finalHealth: winner.health
      });
      return { ...result, gameOver: true, winner };
    }

    return { ...result, gameOver: false };
  }

  applyCardEffects(card, player, target) {
    logger.debug('Applying card effects', {
      cardName: card.name,
      playerId: player.user.id,
      targetId: target.user.id
    });

    let message = `${player.user.username} played ${card.name}!`;
    
    for (const effect of card.effects) {
      switch (effect.type) {
        case 'DAMAGE':
          const damage = target.takeDamage(effect.value);
          message += `\n🗡️ Dealt ${damage} damage to ${target.user.username}!`;
          logger.debug('Applied damage effect', {
            damage,
            targetHealth: target.health
          });
          break;

        case 'HEAL':
          const healing = player.heal(effect.value);
          message += `\n💚 Healed for ${healing} HP!`;
          logger.debug('Applied healing effect', {
            healing,
            playerHealth: player.health
          });
          break;

        case 'WEAKEN':
          target.addEffect('WEAKENED', effect.value);
          message += `\n🔱 Weakened ${target.user.username}'s next attack!`;
          logger.debug('Applied weaken effect', {
            value: effect.value,
            target: target.user.id
          });
          break;

        default:
          logger.debug('Unknown effect type', { type: effect.type });
          break;
      }
    }

    return { success: true, message };
  }

  nextTurn() {
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
    const alivePlayers = Array.from(this.players.values()).filter(p => p.isAlive);
    return alivePlayers.length <= 1;
  }

  getWinner() {
    return Array.from(this.players.values()).find(p => p.isAlive);
  }

  shufflePlayers() {
    for (let i = this.playerOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.playerOrder[i], this.playerOrder[j]] = [this.playerOrder[j], this.playerOrder[i]];
    }
    logger.debug('Shuffled player order', { playerOrder: this.playerOrder });
  }
}