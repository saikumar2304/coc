import { GameManager } from '../managers/GameManager.js';

const gameManager = new GameManager();

export const skip = {
  name: 'skip',
  description: 'Skip your turn',
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
      await message.reply('It\'s not your turn!');
      return;
    }

    const { newTurn, message: roundMessage } = game.nextTurn();
    const nextPlayer = game.players.get(newTurn);
    
    await message.channel.send(`${player.user.username} skipped their turn!`);
    
    if (roundMessage) {
      await message.channel.send(roundMessage);
    }
    
    await message.channel.send(`It's ${nextPlayer.user.username}'s turn! (${game.currentRound.getTimeLeftString()} remaining)`);
  }
};