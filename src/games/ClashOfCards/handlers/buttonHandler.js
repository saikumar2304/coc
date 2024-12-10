import { EmbedBuilder } from 'discord.js';
import { GameManager } from '../managers/GameManager.js';
import { CONFIG } from '../../../utils/config.js';
import { logger } from '../../../utils/logger.js';

export const handleButton = async (interaction) => {
  logger.debug('Button interaction received', {
    customId: interaction.customId,
    user: interaction.user.tag,
    channel: interaction.channel.name
  });

  if (interaction.customId === 'view_cards') {
    const game = GameManager.getGame(interaction.channelId);
    
    if (!game || !game.isStarted) {
      logger.debug('No active game found', { channelId: interaction.channelId });
      await interaction.reply({ 
        content: 'No active game in this channel!', 
        ephemeral: true 
      });
      return;
    }

    const player = game.players.get(interaction.user.id);
    if (!player) {
      logger.debug('Player not found in game', { userId: interaction.user.id });
      await interaction.reply({ 
        content: 'You are not in this game!', 
        ephemeral: true 
      });
      return;
    }

    logger.debug('Showing cards to player', {
      userId: interaction.user.id,
      cardCount: player.hand.length
    });

    const handEmbed = new EmbedBuilder()
      .setColor(CONFIG.colors.info)
      .setTitle('🎴 Your Cards')
      .setDescription(
        player.hand.length > 0 
          ? player.hand.map((card, index) => 
              `${index + 1}. ${card.name}\nType: ${card.type}\nEffect: ${card.description}`
            ).join('\n\n')
          : 'No cards in hand'
      )
      .setFooter({ 
        text: 'Use !play <number> to play a card' 
      });

    await interaction.reply({ 
      embeds: [handEmbed], 
      ephemeral: true 
    });
  }
};