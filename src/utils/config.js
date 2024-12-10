export const CONFIG = {
  prefix: '!',
  owners: ['398285502341578775','1063899809221709824'], // Owner ID added
  cooldown: 3000, // Cooldown in milliseconds
  debug: true, // Enable debug logging
  imageConfig: {
    maxSize: 5242880, // 5MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp'],
    dimensions: {
      card: {
        width: 512,
        height: 720
      },
      thumbnail: {
        width: 256,
        height: 360
      }
    }
  },
  colors: {
    primary: 0x0099ff,
    success: 0x00ff00,
    error: 0xff0000,
    warning: 0xffff00,
    info: 0x00ffff
  },
  game: {
    maxPlayers: 20,
    minPlayers: 2,
    startingHealth: 100,
    maxHealth: 500,
    handSize: 8,
    normalRoundTime: 120000, // 2 minutes
    acceleratedRoundTime: 30000, // 30 seconds
    joinPhaseTime: 60000 // 1 minute
  }
};