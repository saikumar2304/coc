import { GameManager } from '../managers/GameManager.js';
import { CONFIG } from '../../../utils/config.js';

const gameManager = new GameManager();

export const reset = {
  name: 'reset',
  description: 'Reset the game system (Event Manager only)',
  execute: async (message) => {
    if (!CONFIG.owners.includes(message.author.id)) {
      await message.reply('Only Event Managers can use this command!');
      return;
    }

    gameManager.reset();
    await message.reply('Game system has been reset.');
  }
};