import { GameManager } from '../managers/GameManager.js';

const gameManager = new GameManager();

export const roundinfo = {
  name: 'roundinfo',
  description: 'Show information about the current round',
  execute: async (message) => {
    const game = gameManager.getGame(message.channelId);
    
    if (!game || !game.isStarted) {
      await message.reply('No active game in this channel!');
      return;
    }

    const currentPlayer = game.players.get(game.currentTurn);
    const roundType = game.currentRound.isAccelerated ? 'Accelerated' : 'Normal';
    
    const roundEmbed = {
      color: 0x0099ff,
      title: 'Current Round Information',
      fields: [
        {
          name: 'Round Type',
          value: roundType,
          inline: true
        },
        {
          name: 'Time Remaining',
          value: game.currentRound.getTimeLeftString(),
          inline: true
        },
        {
          name: 'Current Turn',
          value: currentPlayer.user.username,
          inline: true
        }
      ]
    };

    await message.reply({ embeds: [roundEmbed] });
  }
};