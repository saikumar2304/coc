import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { GameManager } from '../managers/GameManager.js';
import { CONFIG } from '../../../utils/config.js';
import { logger } from '../../../utils/logger.js';

export const play = {
  name: 'play',
  description: 'Play a card from your hand',
  execute: async (message, args) => {
    logger.debug('Play command received', {
      user: message.author.tag,
      args
    });

    const game = GameManager.getGame(message.channelId);
    
    if (!game || !game.isStarted) {
      logger.error('No active game found', { channelId: message.channelId });
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Error')
        .setDescription('No active game in this channel!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const player = game.players.get(message.author.id);
    if (!player) {
      logger.error('Player not in game', { userId: message.author.id });
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Error')
        .setDescription('You are not in this game!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    if (game.currentTurn !== message.author.id) {
      const currentPlayer = game.players.get(game.currentTurn);
      logger.error('Not player\'s turn', {
        currentTurn: game.currentTurn,
        attemptingPlayer: message.author.id
      });
      
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Error')
        .setDescription(`It's not your turn! Current turn: <@${currentPlayer.user.id}>`);
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const cardIndex = parseInt(args[0]) - 1;
    if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= player.hand.length) {
      logger.error('Invalid card index', { cardIndex, handSize: player.hand.length });
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Error')
        .setDescription('Invalid card number! Use !play <number> to play a card.');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    try {
      const card = player.hand[cardIndex];
      logger.debug('Attempting to play card', {
        cardIndex,
        card: card
      });

      const nextPlayer = game.getNextAlivePlayer(player.user.id);
      if (!nextPlayer) {
        throw new Error('No valid target available!');
      }

      const result = game.playCard(player, cardIndex);
      logger.debug('Card played successfully', { result });

      // Create card played embed
      const cardPlayedEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.primary)
        .setTitle(`🎴 ${card.name}`)
        .setDescription(card.description)
        .addFields(
          { name: '👤 Player', value: player.user.username, inline: true },
          { name: '🎯 Target', value: nextPlayer.user.username, inline: true },
          { name: '❤️ Player Health', value: `${player.health}`, inline: true },
          { name: '💔 Target Health', value: `${nextPlayer.health}`, inline: true }
        );

      await message.channel.send({ embeds: [cardPlayedEmbed] });

      if (result.gameOver) {
        logger.info('Game over', {
          winner: result.winner.user.username,
          finalHealth: result.winner.health
        });

        const gameOverEmbed = new EmbedBuilder()
          .setColor(CONFIG.colors.success)
          .setTitle('👑 Game Over!')
          .setDescription(`${result.winner.user.username} wins!`)
          .addFields(
            { name: '❤️ Final Health', value: `${result.winner.health}`, inline: true }
          );

        await message.channel.send({ embeds: [gameOverEmbed] });
        GameManager.endGame(message.channelId);
      } else {
        const nextTurnPlayer = game.players.get(game.currentTurn);
        logger.debug('Next turn', { player: nextTurnPlayer.user.username });

        // Create View Cards button
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('view_cards')
              .setLabel('View Cards')
              .setStyle(ButtonStyle.Primary)
              .setEmoji('🎴')
          );

        const turnEmbed = new EmbedBuilder()
          .setColor(CONFIG.colors.primary)
          .setTitle('⏭️ Next Turn')
          .setDescription(`It's your turn, <@${nextTurnPlayer.user.id}>!`)
          .addFields(
            { name: '❤️ Health', value: `${nextTurnPlayer.health}`, inline: true },
            { name: '🎴 Cards in Hand', value: `${nextTurnPlayer.hand.length}`, inline: true }
          );

        await message.channel.send({ 
          embeds: [turnEmbed],
          components: [row]
        });
      }
    } catch (error) {
      logger.error('Error playing card', error);
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Error')
        .setDescription(error.message);
      
      await message.reply({ embeds: [errorEmbed] });
    }
  }
};