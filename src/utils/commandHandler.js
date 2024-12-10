import { commands } from '../commands/index.js';
import { CONFIG } from './config.js';
import { handleCooldown } from './cooldown.js';

export const handleCommands = async (message, prefix) => {
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!commands.has(commandName)) return;

  const command = commands.get(commandName);

  // Check cooldown
  const cooldownMessage = handleCooldown(message.author.id, commandName, CONFIG.cooldown);
  if (cooldownMessage) {
    await message.reply(cooldownMessage);
    return;
  }

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    await message.reply('There was an error executing that command!');
  }
};