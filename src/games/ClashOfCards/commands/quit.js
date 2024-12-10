import { EmbedBuilder } from 'discord.js';
import { GameManager } from '../managers/GameManager.js';
import { CONFIG } from '../../../utils/config.js';

export const quit = {
  name: 'quit',
  description: 'Leave the current game',
  execute: async (message) => {
    const game = GameManager.getGame(message.channelId);
    
    if (!game) {
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

    game.removePlayer(message.author.id);
    
    const quitEmbed = new EmbedBuilder()
      .setColor(CONFIG.colors.warning)
      .setTitle('👋 Player Left')
      .setDescription(`${message.author.username} has left the game.`);
    
    await message.reply({ embeds: [quitEmbed] });

    if (game.isStarted && game.players.size < 2) {
      const remainingPlayer = Array.from(game.players.values())[0];
      const gameOverEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.success)
        .setTitle('🏆 Game Over')
        .setDescription(`${remainingPlayer.user.username} wins by default!`);
      
      await message.channel.send({ embeds: [gameOverEmbed] });
      GameManager.endGame(message.channelId);
    }
  }
};