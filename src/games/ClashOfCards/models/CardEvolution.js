import { Elements } from '../constants/elements.js';

export class CardEvolution {
  constructor(baseCard) {
    this.baseCard = baseCard;
    this.level = 1;
    this.experience = 0;
    this.element = null;
  }

  static EVOLUTION_THRESHOLDS = [100, 250, 500, 1000];
  static EXPERIENCE_PER_USE = 10;

  addExperience(amount) {
    this.experience += amount;
    this.checkEvolution();
    return this.level;
  }

  checkEvolution() {
    const previousLevel = this.level;
    while (
      this.level < CardEvolution.EVOLUTION_THRESHOLDS.length + 1 &&
      this.experience >= CardEvolution.EVOLUTION_THRESHOLDS[this.level - 1]
    ) {
      this.level++;
    }
    return this.level > previousLevel;
  }

  getEvolutionStats() {
    const multiplier = 1 + (this.level - 1) * 0.2; // 20% increase per level
    return {
      damage: Math.round(this.baseCard.effects
        .filter(e => e.type === 'DAMAGE')
        .reduce((sum, e) => sum + e.value, 0) * multiplier),
      healing: Math.round(this.baseCard.effects
        .filter(e => e.type === 'HEAL')
        .reduce((sum, e) => sum + e.value, 0) * multiplier)
    };
  }

  evolve(element) {
    if (!Elements[element]) {
      throw new Error('Invalid element type!');
    }
    this.element = element;
    return true;
  }

  getNextEvolutionThreshold() {
    if (this.level > CardEvolution.EVOLUTION_THRESHOLDS.length) {
      return null;
    }
    return CardEvolution.EVOLUTION_THRESHOLDS[this.level - 1];
  }
}