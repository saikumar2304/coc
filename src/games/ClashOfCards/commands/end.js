import { GameManager } from '../managers/GameManager.js';
import { CONFIG } from '../../../utils/config.js';

const gameManager = new GameManager();

export const end = {
  name: 'end',
  description: 'End the current game (Event Manager only)',
  execute: async (message) => {
    if (!CONFIG.owners.includes(message.author.id)) {
      await message.reply('Only Event Managers can use this command!');
      return;
    }

    const game = gameManager.getGame(message.channelId);
    if (!game) {
      await message.reply('No active game in this channel!');
      return;
    }

    gameManager.endGame(message.channelId);
    await message.channel.send('Game has been ended by an Event Manager.');
  }
};