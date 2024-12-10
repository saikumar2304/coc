export class CardCombination {
  constructor() {
    this.combinations = new Map([
      ['FIRE_COMBO', {
        cards: ['Meteor Strike', 'Inferno Blast', 'Phoenix Flame'],
        effect: {
          type: 'MASS_DAMAGE',
          value: 60,
          description: 'Unleash a devastating fire storm dealing 60 damage to all enemies'
        }
      }],
      ['HEALING_COMBO', {
        cards: ['Holy Light', 'Healing Breeze', 'Healing Aura'],
        effect: {
          type: 'MASS_HEAL',
          value: 50,
          description: 'Create a healing sanctuary that restores 50 HP to all allies'
        }
      }],
      ['DARK_COMBO', {
        cards: ['Shadow Fang', 'Shadow Slash', 'Life Drain'],
        effect: {
          type: 'DRAIN',
          value: 40,
          description: 'Embrace darkness to drain 40 HP from all enemies'
        }
      }],
      ['ELEMENTAL_FURY', {
        cards: ['Lightning Spear', 'Blazing Slash', 'Piercing Arrow'],
        effect: {
          type: 'MULTI_TARGET',
          value: 25,
          description: 'Unleash elemental fury dealing 25 damage to three random targets'
        }
      }]
    ]);
  }

  checkCombination(cards) {
    const cardNames = cards.map(card => card.name).sort();
    
    for (const [comboName, combo] of this.combinations) {
      const comboCards = [...combo.cards].sort();
      if (this.arraysEqual(cardNames, comboCards)) {
        return {
          name: comboName,
          ...combo.effect
        };
      }
    }
    return null;
  }

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  }
}