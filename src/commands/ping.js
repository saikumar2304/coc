import { EmbedBuilder } from 'discord.js';
import { CONFIG } from '../utils/config.js';

export const ping = {
  name: 'ping',
  description: 'Check bot latency',
  execute: async (message) => {
    const sent = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(CONFIG.colors.info)
          .setTitle('🏓 Pinging...')
      ]
    });

    const latency = sent.createdTimestamp - message.createdTimestamp;
    
    await sent.edit({
      embeds: [
        new EmbedBuilder()
          .setColor(CONFIG.colors.success)
          .setTitle('🏓 Pong!')
          .addFields(
            { name: 'Bot Latency', value: `${latency}ms`, inline: true },
            { name: 'API Latency', value: `${Math.round(message.client.ws.ping)}ms`, inline: true }
          )
      ]
    });
  },
};