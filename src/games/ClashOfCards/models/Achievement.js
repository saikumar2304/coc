import fs from 'fs';
import path from 'path';

export class Achievement {
  constructor() {
    this.achievements = new Map();
    this.loadAchievements();
  }

  loadAchievements() {
    try {
      const data = fs.readFileSync(path.join(process.cwd(), 'data', 'achievements.json'), 'utf8');
      const parsed = JSON.parse(data);
      this.achievements = new Map(Object.entries(parsed));
    } catch (error) {
      this.achievements = new Map();
    }
  }

  saveAchievements() {
    const data = Object.fromEntries(this.achievements);
    try {
      if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
        fs.mkdirSync(path.join(process.cwd(), 'data'));
      }
      fs.writeFileSync(
        path.join(process.cwd(), 'data', 'achievements.json'),
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  checkAchievement(userId, type, value) {
    const userAchievements = this.achievements.get(userId) || {
      gamesPlayed: 0,
      gamesWon: 0,
      perfectWins: 0,
      comboMaster: 0,
      survivalKing: 0,
      unlocked: []
    };

    const newAchievements = [];

    switch (type) {
      case 'GAMES_PLAYED':
        userAchievements.gamesPlayed++;
        if (userAchievements.gamesPlayed >= 100 && !userAchievements.unlocked.includes('VETERAN')) {
          userAchievements.unlocked.push('VETERAN');
          newAchievements.push('Veteran: Play 100 games');
        }
        break;

      case 'GAME_WIN':
        userAchievements.gamesWon++;
        if (userAchievements.gamesWon >= 50 && !userAchievements.unlocked.includes('CHAMPION')) {
          userAchievements.unlocked.push('CHAMPION');
          newAchievements.push('Champion: Win 50 games');
        }
        break;

      case 'PERFECT_WIN':
        userAchievements.perfectWins++;
        if (userAchievements.perfectWins >= 10 && !userAchievements.unlocked.includes('PERFECTIONIST')) {
          userAchievements.unlocked.push('PERFECTIONIST');
          newAchievements.push('Perfectionist: Win 10 games with full health');
        }
        break;

      case 'COMBO':
        userAchievements.comboMaster = Math.max(userAchievements.comboMaster, value);
        if (value >= 5 && !userAchievements.unlocked.includes('COMBO_MASTER')) {
          userAchievements.unlocked.push('COMBO_MASTER');
          newAchievements.push('Combo Master: Play 5 cards in one turn');
        }
        break;

      case 'LOW_HEALTH_WIN':
        userAchievements.survivalKing++;
        if (userAchievements.survivalKing >= 5 && !userAchievements.unlocked.includes('SURVIVOR')) {
          userAchievements.unlocked.push('SURVIVOR');
          newAchievements.push('Survivor: Win 5 games with less than 10 HP');
        }
        break;
    }

    this.achievements.set(userId, userAchievements);
    this.saveAchievements();
    return newAchievements;
  }

  getPlayerAchievements(userId) {
    return this.achievements.get(userId) || {
      gamesPlayed: 0,
      gamesWon: 0,
      perfectWins: 0,
      comboMaster: 0,
      survivalKing: 0,
      unlocked: []
    };
  }
}