import { EmbedBuilder } from 'discord.js';
import { GameManager } from '../../games/ClashOfCards/managers/GameManager.js';
import { Player } from '../../games/ClashOfCards/models/Player.js';
import { CONFIG } from '../../utils/config.js';
import { GameConfig } from '../../games/ClashOfCards/constants/gameConfig.js';
import { logger } from '../../utils/logger.js';

export const start = {
  name: 'start',
  description: 'Start a new Clash of Cards game',
  execute: async (message) => {
    logger.info('Start command received', {
      user: message.author.tag,
      channel: message.channel.name
    });

    const game = GameManager.createGame(message.channelId);
    
    if (!game) {
      logger.debug('Game already exists in channel', {
        channelId: message.channelId
      });

      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Game Already Exists')
        .setDescription('A game is already in progress in this channel!');
      
      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const player = new Player(message.author);
    game.addPlayer(player);

    logger.info('Game created successfully', {
      channelId: message.channelId,
      firstPlayer: message.author.tag
    });

    const startEmbed = new EmbedBuilder()
      .setColor(CONFIG.colors.primary)
      .setTitle('🎮 Clash of Cards')
      .setDescription('A new game has been created!')
      .addFields(
        { 
          name: '👥 How to Join', 
          value: 'Use `!join` to enter the game' 
        },
        {
          name: '📋 Player Limits',
          value: `Min: ${GameConfig.MIN_PLAYERS} | Max: ${GameConfig.MAX_PLAYERS}`
        },
        {
          name: '▶️ Starting the Game',
          value: 'Use `!begin` when all players have joined to start the game'
        },
        {
          name: '👤 Current Players',
          value: message.author.username
        }
      );

    await message.reply({ embeds: [startEmbed] });
  },
};