import { EmbedBuilder } from 'discord.js';
import { commands } from './index.js';
import { CONFIG } from '../utils/config.js';

export const help = {
  name: 'help',
  description: 'List all commands or info about a specific command',
  execute: async (message, args) => {
    const prefix = '!';
    
    if (!args.length) {
      const commandList = Array.from(commands.values())
        .map(cmd => `\`${prefix}${cmd.name}\`: ${cmd.description}`)
        .join('\n');
      
      const embed = new EmbedBuilder()
        .setColor(CONFIG.colors.info)
        .setTitle('📚 Command List')
        .setDescription(commandList)
        .setFooter({ text: `Use ${prefix}help <command> for detailed info about a specific command` });

      await message.reply({ embeds: [embed] });
      return;
    }

    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName);

    if (!command) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Error')
        .setDescription('That command doesn\'t exist!');

      await message.reply({ embeds: [errorEmbed] });
      return;
    }

    const commandEmbed = new EmbedBuilder()
      .setColor(CONFIG.colors.info)
      .setTitle(`Command: ${prefix}${command.name}`)
      .setDescription(command.description);

    await message.reply({ embeds: [commandEmbed] });
  },
};