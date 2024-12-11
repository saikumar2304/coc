import { Elements, ElementalRelations, ElementalBonus } from '../constants/elements.js';
import { logger } from '../../../utils/logger.js';

export class CardInteraction {
  constructor() {
    this.elementalCombos = new Map([
      ['FIRE_WATER', {
        name: 'Steam Burst',
        damage: 40,
        effect: 'STUN'
      }],
      ['FIRE_EARTH', {
        name: 'Magma Eruption',
        damage: 50,
        effect: 'BURN'
      }],
      ['WATER_AIR', {
        name: 'Ice Storm',
        damage: 35,
        effect: 'FREEZE'
      }],
      ['LIGHT_DARK', {
        name: 'Twilight Surge',
        damage: 60,
        effect: 'DRAIN'
      }]
    ]);
  }

  calculateElementalDamage(attackElement, targetElement, baseDamage) {
    if (!attackElement || !targetElement) return baseDamage;

    const relations = ElementalRelations[attackElement];
    if (!relations) return baseDamage;

    if (relations.strong.includes(targetElement)) {
      return Math.floor(baseDamage * ElementalBonus.ADVANTAGE);
    } else if (relations.weak.includes(targetElement)) {
      return Math.floor(baseDamage * ElementalBonus.DISADVANTAGE);
    }

    return baseDamage;
  }

  checkElementalCombo(card1, card2) {
    if (!card1.element || !card2.element) return null;

    const comboKey = [card1.element, card2.element].sort().join('_');
    return this.elementalCombos.get(comboKey);
  }

  getElementalDescription(element) {
    const descriptions = {
      [Elements.FIRE]: "Deals bonus damage to Earth and Air, weak against Water",
      [Elements.WATER]: "Deals bonus damage to Fire and Earth, weak against Air",
      [Elements.EARTH]: "Deals bonus damage to Air and Water, weak against Fire",
      [Elements.AIR]: "Deals bonus damage to Water and Earth, weak against Fire",
      [Elements.LIGHT]: "Strong against Dark",
      [Elements.DARK]: "Strong against Light"
    };

    return descriptions[element] || "No elemental properties";
  }

  getElementalSymbol(element) {
    const symbols = {
      [Elements.FIRE]: "🔥",
      [Elements.WATER]: "💧",
      [Elements.EARTH]: "🌍",
      [Elements.AIR]: "💨",
      [Elements.LIGHT]: "✨",
      [Elements.DARK]: "🌑"
    };

    return symbols[element] || "";
  }
} 