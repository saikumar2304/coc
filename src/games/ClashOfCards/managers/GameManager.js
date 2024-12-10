import { Game } from '../models/Game.js';

class GameManager {
  static instance = null;
  activeGames = new Map();

  static getInstance() {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  static getGame(channelId) {
    return GameManager.getInstance().activeGames.get(channelId);
  }

  static createGame(channelId) {
    const instance = GameManager.getInstance();
    if (!instance.activeGames.has(channelId)) {
      const game = new Game(channelId);
      instance.activeGames.set(channelId, game);
      return game;
    }
    return null;
  }

  static endGame(channelId) {
    return GameManager.getInstance().activeGames.delete(channelId);
  }

  static reset() {
    GameManager.getInstance().activeGames.clear();
  }
}

export { GameManager };