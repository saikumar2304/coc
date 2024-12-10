import { EmbedBuilder } from 'discord.js';
import { GameManager } from '../../games/ClashOfCards/managers/GameManager.js';
import { Player } from '../../games/ClashOfCards/models/Player.js';
import { CONFIG } from '../../utils/config.js';

export const join = {
  name: 'join',
  description: 'Join an existing Clash of Cards game',
  execute: async (message) => {
    const game = GameManager.getGame(message.channelId);
    
    if (!game) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ No Active Game')
        .setDescription('No active game in this channel. Use `!start` to create a new game!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    if (game.isStarted) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Game In Progress')
        .setDescription('Cannot join - game has already started!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    if (game.players.has(message.author.id)) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Already Joined')
        .setDescription('You have already joined this game!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const player = new Player(message.author);
    if (game.addPlayer(player)) {
      const joinEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.success)
        .setTitle('✅ Player Joined')
        .setDescription(`${message.author.username} has joined the game!`)
        .addFields({
          name: '👥 Current Players',
          value: Array.from(game.players.values())
            .map(p => p.user.username)
            .join('\n')
        });

      await message.reply({ embeds: [joinEmbed] });
    } else {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Cannot Join')
        .setDescription('Cannot join the game. The game might be full.');
      
      await message.reply({ embeds: [errorEmbed] });
    }
  }
};