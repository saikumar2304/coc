import { Achievement } from '../models/Achievement.js';

const achievement = new Achievement();

export const achievements = {
  name: 'achievements',
  description: 'View your achievements',
  execute: async (message) => {
    const playerAchievements = achievement.getPlayerAchievements(message.author.id);

    const achievementEmbed = {
      color: 0x0099ff,
      title: `${message.author.username}'s Achievements`,
      fields: [
        {
          name: 'Statistics',
          value: [
            `Games Played: ${playerAchievements.gamesPlayed}`,
            `Games Won: ${playerAchievements.gamesWon}`,
            `Perfect Wins: ${playerAchievements.perfectWins}`,
            `Best Combo: ${playerAchievements.comboMaster}`,
            `Low Health Wins: ${playerAchievements.survivalKing}`
          ].join('\n'),
          inline: false
        },
        {
          name: 'Unlocked Achievements',
          value: playerAchievements.unlocked.length > 0 
            ? playerAchievements.unlocked.join('\n')
            : 'No achievements unlocked yet',
          inline: false
        }
      ],
      footer: {
        text: 'Keep playing to unlock more achievements!'
      }
    };

    await message.reply({ embeds: [achievementEmbed] });
  }
};