import { SlashCommandBuilder } from '@discordjs/builders';
import { games } from '../gameManager.js';
import { logger } from '../../../utils/logger.js';

export const saveCommand = {
  data: new SlashCommandBuilder()
    .setName('save')
    .setDescription('Save or load game state')
    .addSubcommand(subcommand =>
      subcommand
        .setName('game')
        .setDescription('Save current game state'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('load')
        .setDescription('Load a saved game')
        .addBooleanOption(option =>
          option
            .setName('backup')
            .setDescription('Load from backup instead')
            .setRequired(false)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List available saves')),

  async execute(interaction) {
    const game = games.get(interaction.channelId);
    if (!game) {
      return interaction.reply('No active game in this channel!');
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'game':
        const saved = await game.saveGameState();
        if (saved) {
          return interaction.reply('Game state saved successfully!');
        }
        return interaction.reply('Failed to save game state.');

      case 'load':
        const useBackup = interaction.options.getBoolean('backup') || false;
        const loaded = await game.loadGameState(useBackup);
        if (loaded) {
          return interaction.reply('Game state loaded successfully!');
        }
        return interaction.reply('Failed to load game state.');

      case 'list':
        const saves = await game.listSaves();
        if (!saves || saves.length === 0) {
          return interaction.reply('No saves found.');
        }
        
        const saveList = saves.map(save => 
          `• ${save.filename} (${new Date(save.timestamp).toLocaleString()})`
        ).join('\n');
        
        return interaction.reply(`Available saves:\n${saveList}`);
    }
  }
}; 