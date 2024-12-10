import { EmbedBuilder } from 'discord.js';
import { GameManager } from '../managers/GameManager.js';
import { CONFIG } from '../../../utils/config.js';
import { GameConfig } from '../constants/gameConfig.js';

export const status = {
  name: 'status',
  description: 'Show your current game status',
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

    const player = game.players.get(message.author.id);
    if (!player) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Error')
        .setDescription('You are not in this game!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const handDescription = player.hand
      .map((card, index) => `${index + 1}. ${card.name} (${card.description})`)
      .join('\n');

    const statusEmbed = new EmbedBuilder()
      .setColor(CONFIG.colors.info)
      .setTitle(`${player.user.username}'s Status`)
      .addFields(
        {
          name: '❤️ Health',
          value: `${player.health}/${GameConfig.STARTING_HEALTH}`,
          inline: true
        },
        {
          name: '✨ Active Effects',
          value: player.activeEffects.size > 0 
            ? Array.from(player.activeEffects.entries())
              .map(([effect, value]) => `${effect}: ${value}`)
              .join('\n')
            : 'None',
          inline: true
        },
        {
          name: '🎴 Your Cards',
          value: handDescription || 'No cards in hand'
        }
      );

    await message.reply({ embeds: [statusEmbed] });
  }
};