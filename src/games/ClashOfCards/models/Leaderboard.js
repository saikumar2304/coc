import fs from 'fs';
import path from 'path';

export class Leaderboard {
  constructor() {
    this.data = new Map();
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    try {
      const data = fs.readFileSync(path.join(process.cwd(), 'data', 'leaderboard.json'), 'utf8');
      const parsed = JSON.parse(data);
      this.data = new Map(Object.entries(parsed));
    } catch (error) {
      this.data = new Map();
    }
  }

  saveLeaderboard() {
    const data = Object.fromEntries(this.data);
    try {
      if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
        fs.mkdirSync(path.join(process.cwd(), 'data'));
      }
      fs.writeFileSync(
        path.join(process.cwd(), 'data', 'leaderboard.json'),
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      console.error('Error saving leaderboard:', error);
    }
  }

  addWin(userId, username) {
    const userData = this.data.get(userId) || { username, wins: 0, gamesPlayed: 0 };
    userData.wins += 1;
    userData.gamesPlayed += 1;
    this.data.set(userId, userData);
    this.saveLeaderboard();
  }

  addGame(userId, username) {
    const userData = this.data.get(userId) || { username, wins: 0, gamesPlayed: 0 };
    userData.gamesPlayed += 1;
    this.data.set(userId, userData);
    this.saveLeaderboard();
  }

  getTopPlayers(limit = 10) {
    return Array.from(this.data.entries())
      .sort(([, a], [, b]) => b.wins - a.wins)
      .slice(0, limit)
      .map(([id, data]) => ({
        id,
        username: data.username,
        wins: data.wins,
        gamesPlayed: data.gamesPlayed,
        winRate: ((data.wins / data.gamesPlayed) * 100).toFixed(1)
      }));
  }

  getPlayerStats(userId) {
    const stats = this.data.get(userId);
    if (!stats) return null;
    return {
      ...stats,
      winRate: ((stats.wins / stats.gamesPlayed) * 100).toFixed(1)
    };
  }
}