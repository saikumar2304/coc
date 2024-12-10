import { GameManager } from '../managers/GameManager.js';
import { CONFIG } from '../../../utils/config.js';

const gameManager = new GameManager();

export const forceround = {
  name: 'forceround',
  description: 'Force the next round type (Event Manager only)',
  execute: async (message, args) => {
    if (!CONFIG.owners.includes(message.author.id)) {
      await message.reply('Only Event Managers can use this command!');
      return;
    }

    const game = gameManager.getGame(message.channelId);
    if (!game || !game.isStarted) {
      await message.reply('No active game in this channel!');
      return;
    }

    const type = args[0]?.toLowerCase();
    if (!['normal', 'accelerated'].includes(type)) {
      await message.reply('Please specify either "normal" or "accelerated"');
      return;
    }

    game.forceNextRoundType(type === 'accelerated');
    await message.reply(`Next round will be ${type}!`);
  }
};