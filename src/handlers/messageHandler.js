import { handleCommands } from '../utils/commandHandler.js';

export const handleMessage = async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Check for command prefix
  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  // Handle commands
  await handleCommands(message, prefix);
};