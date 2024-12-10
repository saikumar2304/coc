import { Client, GatewayIntentBits, Collection } from "discord.js";
import { config } from "dotenv";
import { commands } from "./commands/index.js";
import { handleButton } from "./games/ClashOfCards/handlers/buttonHandler.js";
import { logger } from "./utils/logger.js";

// Load environment variables
config();

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Store commands in client for easy access
client.commands = new Collection();
for (const [name, command] of commands) {
  client.commands.set(name, command);
}

// Command handler
client.on("messageCreate", async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Check for command prefix
  const prefix = "!";
  if (!message.content.startsWith(prefix)) return;

  // Parse command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Get command
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    logger.info(`Executing command: ${commandName}`, {
      user: message.author.tag,
      guild: message.guild?.name,
      channel: message.channel.name,
      args,
    });

    await command.execute(message, args);
  } catch (error) {
    logger.error(`Error executing command: ${commandName}`, error);
    await message.reply("There was an error executing that command!");
  }
});

// Button interaction handler
client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    try {
      await handleButton(interaction);
    } catch (error) {
      logger.error("Error handling button interaction", error);
      await interaction.reply({
        content: "There was an error processing your interaction!",
        ephemeral: true,
      });
    }
  }
});

// Ready event handler
client.once("ready", () => {
  logger.info("Bot is ready!", {
    username: client.user.tag,
    guilds: client.guilds.cache.size,
  });
});

// Error handler
client.on("error", (error) => {
  logger.error("Discord client error:", error);
});

// Login
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  logger.error("Failed to login:", error);
  process.exit(1);
});
