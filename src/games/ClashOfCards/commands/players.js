import { EmbedBuilder } from 'discord.js';
import { GameManager } from '../managers/GameManager.js';
import { CONFIG } from '../../../utils/config.js';

export const players = {
  name: 'players',
  description: 'Show all players and their health',
  execute: async (message) => {
    const game = GameManager.getGame(message.channelId);
    
    if (!game || !game.isStarted) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Error')
        .setDescription('No active game in this channel!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const playerList = Array.from(game.players.values())
      .map(player => `${player.user.username}: ${player.health} HP ${player.isAlive ? '❤️' : '💀'}`)
      .join('\n');

    const playersEmbed = new EmbedBuilder()
      .setColor(CONFIG.colors.info)
      .setTitle('👥 Current Players')
      .setDescription(playerList)
      .setFooter({ 
        text: `Current turn: ${game.players.get(game.currentTurn)?.user.username || 'None'}` 
      });

    await message.reply({ embeds: [playersEmbed] });
  }
};