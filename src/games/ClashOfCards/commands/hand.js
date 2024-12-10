import { GameManager } from '../managers/GameManager.js';

const gameManager = new GameManager();

export const hand = {
  name: 'hand',
  description: 'Display your current cards',
  execute: async (message) => {
    const game = gameManager.getGame(message.channelId);
    
    if (!game || !game.isStarted) {
      await message.reply('No active game in this channel!');
      return;
    }

    const player = game.players.get(message.author.id);
    if (!player) {
      await message.reply('You are not in this game!');
      return;
    }

    const handEmbed = {
      color: 0x0099ff,
      title: `${player.user.username}'s Hand`,
      description: player.hand.length === 0 ? 'No cards in hand' : '',
      fields: player.hand.map((card, index) => ({
        name: `${index + 1}. ${card.name}`,
        value: `Type: ${card.type}\nDescription: ${card.description}`,
        inline: true
      })),
      footer: {
        text: 'Use !play <card number> [@target] to play a card'
      }
    };

    // Send as DM to keep cards private
    try {
      await message.author.send({ embeds: [handEmbed] });
      await message.reply('I\'ve sent your hand details in a private message!');
    } catch (error) {
      await message.reply('I couldn\'t send you a DM. Please enable DMs from server members.');
    }
  }
};