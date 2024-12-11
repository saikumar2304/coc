module.exports = {
  name: 'help',
  description: 'Shows available commands',
  execute(interaction) {
    const helpText = `
**Available Commands:**
• /join - Join the game
• /start - Start the game
• /play <card number> - Play a card from your hand
• /status - Check game status and your hand
• /help - Show this help message
    `;
    
    return interaction.reply({ content: helpText, ephemeral: true });
  },
}; 