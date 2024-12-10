import { GameConfig } from '../constants/gameConfig.js';

export class Round {
  constructor(isAccelerated = false) {
    this.isAccelerated = isAccelerated;
    this.startTime = Date.now();
    this.duration = isAccelerated ? 
      GameConfig.ACCELERATED_ROUND_TIME : 
      GameConfig.NORMAL_ROUND_TIME;
  }

  getRemainingTime() {
    const elapsed = Date.now() - this.startTime;
    return Math.max(0, this.duration - elapsed);
  }

  isTimeUp() {
    return this.getRemainingTime() <= 0;
  }

  getTimeLeftString() {
    const remaining = this.getRemainingTime();
    return `${Math.ceil(remaining / 1000)} seconds`;
  }
}