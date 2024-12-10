import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { GameManager } from '../../games/ClashOfCards/managers/GameManager.js';
import { CONFIG } from '../../utils/config.js';
import { GameConfig } from '../../games/ClashOfCards/constants/gameConfig.js';

export const begin = {
  name: 'begin',
  description: 'Start the game after players have joined',
  execute: async (message) => {
    const game = GameManager.getGame(message.channelId);
    
    if (!game) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ No Active Game')
        .setDescription('No game has been created. Use `!start` to create a new game!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    if (game.isStarted) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Game Already Started')
        .setDescription('The game has already begun!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    if (game.players.size < GameConfig.MIN_PLAYERS) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Not Enough Players')
        .setDescription(`Need at least ${GameConfig.MIN_PLAYERS} players to start. Current players: ${game.players.size}`);
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    if (game.startGame()) {
      // Create button for viewing cards
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('view_cards')
            .setLabel('View Cards')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🎴')
        );

      const gameStartEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.success)
        .setTitle('🎮 Game Starting!')
        .setDescription(`Get ready to clash! <@${game.currentTurn}> goes first!`)
        .addFields(
          { 
            name: '👥 Players', 
            value: Array.from(game.players.values())
              .map(p => `<@${p.user.id}>: ${p.health}HP`)
              .join('\n')
          }
        );
      
      await message.channel.send({ 
        content: Array.from(game.players.values())
          .map(p => `<@${p.user.id}>`)
          .join(' '), 
        embeds: [gameStartEmbed],
        components: [row]
      });
    }
  }
};