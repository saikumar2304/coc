import { EmbedBuilder } from 'discord.js';
import { CONFIG } from '../../../utils/config.js';
import { GameConfig } from '../constants/gameConfig.js';
import { getCardImagePath } from '../constants/imageConfig.js';

export const createEmbed = {
  error: (message) => {
    return new EmbedBuilder()
      .setColor(CONFIG.colors.error)
      .setTitle('❌ Error')
      .setDescription(message);
  },

  success: (message) => {
    return new EmbedBuilder()
      .setColor(CONFIG.colors.success)
      .setTitle('✅ Success')
      .setDescription(message);
  },

  cardPlayed: (player, card, target, result) => {
    return new EmbedBuilder()
      .setColor(CONFIG.colors.primary)
      .setTitle(`🎴 ${card.name}`)
      .setDescription(result.message)
      .setImage(getCardImagePath(card))
      .addFields(
        { name: '👤 Player', value: player.user.username, inline: true },
        { name: '🎯 Target', value: target.user.username, inline: true },
        { name: '❤️ Player Health', value: `${player.health}/${GameConfig.MAX_HEALTH}`, inline: true },
        { name: '💔 Target Health', value: `${target.health}/${GameConfig.MAX_HEALTH}`, inline: true }
      );
  },

  gameStart: (game) => {
    return new EmbedBuilder()
      .setColor(CONFIG.colors.success)
      .setTitle('🎮 Game Started!')
      .setDescription('The battle begins!')
      .addFields(
        { 
          name: '👥 Players', 
          value: Array.from(game.players.values())
            .map(p => `${p.user.username}: ${p.health}/${GameConfig.MAX_HEALTH} HP`)
            .join('\n') 
        },
        { 
          name: '🎯 First Turn', 
          value: `<@${game.currentTurn}>` 
        }
      );
  },

  turnNotification: (player) => {
    return new EmbedBuilder()
      .setColor(CONFIG.colors.primary)
      .setTitle('⏰ Your Turn!')
      .setDescription(`<@${player.user.id}> it's your turn to play!`)
      .addFields(
        { name: '❤️ Your Health', value: `${player.health}/${GameConfig.MAX_HEALTH}`, inline: true },
        { name: '🎴 Cards in Hand', value: `${player.hand.length}`, inline: true }
      );
  },

  gameOver: (winner) => {
    return new EmbedBuilder()
      .setColor(CONFIG.colors.success)
      .setTitle('👑 Game Over!')
      .setDescription(`${winner.user.username} wins!`)
      .addFields(
        { name: '❤️ Final Health', value: `${winner.health}/${GameConfig.MAX_HEALTH}`, inline: true }
      );
  }
};