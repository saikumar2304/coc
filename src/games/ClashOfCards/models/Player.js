import { GameConfig } from "../constants/gameConfig.js";
import { logger } from "../../../utils/logger.js";

export class Player {
  constructor(discordUser) {
    this.user = discordUser;
    this.health = GameConfig.STARTING_HEALTH;
    this.hand = [];
    this.isAlive = true;
    this.activeEffects = new Map();
    this.damageBoost = 0;

    logger.debug("Player instance created", {
      userId: discordUser.id,
      startingHealth: this.health,
    });
  }

  takeDamage(amount, ignoreEffects = []) {
    if (
      !ignoreEffects.includes("IMMUNITY") &&
      this.activeEffects.has("IMMUNITY")
    ) {
      this.activeEffects.delete("IMMUNITY");
      logger.debug("Damage blocked by immunity", {
        playerId: this.user.id,
        damageAmount: amount,
      });
      return { damage: 0, immunity: true };
    }

    if (
      !ignoreEffects.includes("REFLECT") &&
      this.activeEffects.has("REFLECT")
    ) {
      return { reflect: true };
    }

    const actualDamage = Math.min(this.health, amount);
    this.health = Math.max(0, this.health - actualDamage);

    logger.debug("Player took damage", {
      playerId: this.user.id,
      damage: actualDamage,
      remainingHealth: this.health,
    });

    if (this.health <= 0) {
      this.isAlive = false;
      logger.info("Player defeated", { playerId: this.user.id });
    }

    return { damage: actualDamage };
  }

  heal(amount) {
    if (this.activeEffects.has("DISABLE_HEALING")) {
      this.activeEffects.delete("DISABLE_HEALING");
      logger.debug("Healing blocked by effect", {
        playerId: this.user.id,
        healAmount: amount,
      });
      return 0;
    }

    const oldHealth = this.health;
    this.health = Math.min(GameConfig.MAX_HEALTH, this.health + amount);
    const healedAmount = this.health - oldHealth;

    logger.debug("Player healed", {
      playerId: this.user.id,
      healAmount: healedAmount,
      newHealth: this.health,
    });

    return healedAmount;
  }

  drawCard(card) {
    if (this.hand.length < GameConfig.HAND_SIZE) {
      this.hand.push(card);
      logger.debug("Card drawn", {
        playerId: this.user.id,
        cardName: card.name,
        handSize: this.hand.length,
      });
      return true;
    }

    logger.debug("Cannot draw card - hand full", {
      playerId: this.user.id,
      handSize: this.hand.length,
    });
    return false;
  }

  removeCard(cardIndex) {
    if (cardIndex >= 0 && cardIndex < this.hand.length) {
      const card = this.hand.splice(cardIndex, 1)[0];
      logger.debug("Card removed from hand", {
        playerId: this.user.id,
        cardName: card.name,
        remainingCards: this.hand.length,
      });
      return card;
    }
    return null;
  }

  addEffect(effect) {
    this.activeEffects.set(effect, true);
    logger.debug("Effect added to player", {
      playerId: this.user.id,
      effect,
    });
  }

  applyDamageBoost(boostAmount) {
    this.damageBoost += boostAmount;
    logger.debug("Damage boost applied", {
      playerId: this.user.id,
      boostAmount: this.damageBoost,
    });
  }

  calculateBoostedDamage(damage) {
    if (this.damageBoost > 0) {
      this.damageBoost = 0;
      return damage + this.damageBoost;
    } else {
      return damage;
    }
  }

  updateEffects() {
    for (const [effect, duration] of this.activeEffects.entries()) {
      if (duration <= 1) {
        this.activeEffects.delete(effect);
        logger.debug("Effect expired", {
          playerId: this.user.id,
          effect,
        });
      } else {
        this.activeEffects.set(effect, duration - 1);
        logger.debug("Effect duration decreased", {
          playerId: this.user.id,
          effect,
          remainingDuration: duration - 1,
        });
      }
    }
  }

  swapHealth(newHealth) {
    const oldHealth = this.health;
    this.health = newHealth;
    return { oldHealth, updatedHealth: this.health };
  }
}
