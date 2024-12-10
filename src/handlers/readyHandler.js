export const handleReady = (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot is ready to serve ${client.guilds.cache.size} servers`);
};