import { EffectType } from '../constants/gameConfig.js';
import { logger } from '../../../utils/logger.js';

export class EffectCombination {
  static combineEffects(effects) {
    const combinedEffects = new Map();

    for (const effect of effects) {
      if (this.canCombine(effect.type)) {
        const existing = combinedEffects.get(effect.type);
        if (existing) {
          combinedEffects.set(effect.type, this.mergeEffects(existing, effect));
        } else {
          combinedEffects.set(effect.type, effect);
        }
      } else {
        // Effects that don't combine just get added
        combinedEffects.set(`${effect.type}_${Date.now()}`, effect);
      }
    }

    return Array.from(combinedEffects.values());
  }

  static canCombine(effectType) {
    const combinableEffects = [
      EffectType.DAMAGE,
      EffectType.HEAL,
      EffectType.SHIELD,
      EffectType.POISON,
      EffectType.BURN
    ];
    return combinableEffects.includes(effectType);
  }

  static mergeEffects(effect1, effect2) {
    switch (effect1.type) {
      case EffectType.DAMAGE:
      case EffectType.HEAL:
        return {
          type: effect1.type,
          value: effect1.value + effect2.value
        };

      case EffectType.SHIELD:
        return {
          type: EffectType.SHIELD,
          value: Math.max(effect1.value, effect2.value)
        };

      case EffectType.POISON:
      case EffectType.BURN:
        return {
          type: effect1.type,
          value: Math.max(effect1.value, effect2.value),
          duration: Math.max(effect1.duration, effect2.duration)
        };

      default:
        return effect1;
    }
  }
} 