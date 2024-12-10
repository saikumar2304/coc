import { EmbedBuilder } from 'discord.js';
import { CONFIG } from '../utils/config.js';

export const kick = {
  name: 'kick',
  description: 'Kick a member from the server',
  permission: 'KickMembers',
  execute: async (message, args) => {
    if (!message.member.permissions.has('KickMembers')) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Permission Denied')
        .setDescription('You do not have permission to use this command.');
      
      return message.reply({ embeds: [errorEmbed] });
    }

    const member = message.mentions.members.first();
    if (!member) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Invalid Usage')
        .setDescription('Please mention a member to kick.');
      
      return message.reply({ embeds: [errorEmbed] });
    }

    if (!member.kickable) {
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Cannot Kick')
        .setDescription('I cannot kick this member.');
      
      return message.reply({ embeds: [errorEmbed] });
    }

    try {
      await member.kick();
      const successEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.success)
        .setTitle('✅ Member Kicked')
        .setDescription(`Successfully kicked ${member.user.tag}`);
      
      await message.reply({ embeds: [successEmbed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor(CONFIG.colors.error)
        .setTitle('❌ Error')
        .setDescription('There was an error trying to kick this member.');
      
      await message.reply({ embeds: [errorEmbed] });
    }
  },
};