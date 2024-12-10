import { GameManager } from '../managers/GameManager.js';

const gameManager = new GameManager();

export const draw = {
  name: 'draw',
  description: 'Draw a card if available',
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

    if (game.currentTurn !== message.author.id) {
      await message.reply('You can only draw a card during your turn!');
      return;
    }

    if (player.hand.length >= 8) {
      await message.reply('Your hand is full! (Maximum 8 cards)');
      return;
    }

    const card = game.drawCard();
    if (card) {
      player.drawCard(card);
      
      // Send card info as DM
      const cardEmbed = {
        color: 0x0099ff,
        title: 'Card Drawn',
        fields: [
          {
            name: card.name,
            value: `Type: ${card.type}\nDescription: ${card.description}`
          }
        ]
      };

      try {
        await message.author.send({ embeds: [cardEmbed] });
        await message.reply('You drew a card! Check your DMs for details.');
      } catch (error) {
        await message.reply('Drew a card, but couldn\'t send details. Enable DMs from server members.');
      }
    } else {
      await message.reply('No cards left in the deck!');
    }
  }
};