import { GameManager } from '../managers/GameManager.js';
import { Leaderboard } from '../models/Leaderboard.js';

const gameManager = new GameManager();
const leaderboard = new Leaderboard();

export const leaderboardCommand = {
  name: 'leaderboard',
  description: 'Show the top players and their stats',
  execute: async (message, args) => {
    if (args[0] === 'me') {
      const stats = leaderboard.getPlayerStats(message.author.id);
      if (!stats) {
        await message.reply('You haven\'t played any games yet!');
        return;
      }

      const personalEmbed = {
        color: 0x0099ff,
        title: `${message.author.username}'s Stats`,
        fields: [
          {
            name: 'Wins',
            value: stats.wins.toString(),
            inline: true
          },
          {
            name: 'Games Played',
            value: stats.gamesPlayed.toString(),
            inline: true
          },
          {
            name: 'Win Rate',
            value: `${stats.winRate}%`,
            inline: true
          }
        ]
      };

      await message.reply({ embeds: [personalEmbed] });
      return;
    }

    const topPlayers = leaderboard.getTopPlayers();
    if (topPlayers.length === 0) {
      await message.reply('No games have been played yet!');
      return;
    }

    const leaderboardEmbed = {
      color: 0x0099ff,
      title: 'Clash of Cards Leaderboard',
      description: 'Top Players',
      fields: topPlayers.map((player, index) => ({
        name: `${index + 1}. ${player.username}`,
        value: `Wins: ${player.wins} | Games: ${player.gamesPlayed} | Win Rate: ${player.winRate}%`,
        inline: false
      })),
      footer: {
        text: 'Use !leaderboard me to see your personal stats'
      }
    };

    await message.reply({ embeds: [leaderboardEmbed] });
  }
};