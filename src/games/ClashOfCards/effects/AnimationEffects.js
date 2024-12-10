export const AnimationEffects = {
  FIRE: {
    prefix: '🔥',
    animation: ['⚪', '🟡', '🟠', '🔴'],
    duration: 2000
  },
  WATER: {
    prefix: '💧',
    animation: ['⚪', '🔵', '💠', '🌊'],
    duration: 2000
  },
  EARTH: {
    prefix: '🌍',
    animation: ['⚪', '🟤', '⭐', '💥'],
    duration: 2000
  },
  AIR: {
    prefix: '💨',
    animation: ['⚪', '🌪️', '☁️', '⭐'],
    duration: 2000
  },
  LIGHT: {
    prefix: '✨',
    animation: ['⚪', '💫', '⭐', '🌟'],
    duration: 2000
  },
  DARK: {
    prefix: '🌑',
    animation: ['⚪', '🌘', '🌑', '⚫'],
    duration: 2000
  },
  HEAL: {
    prefix: '💚',
    animation: ['⚪', '💚', '💗', '❤️'],
    duration: 2000
  },
  DAMAGE: {
    prefix: '⚔️',
    animation: ['⚪', '💥', '⚔️', '☠️'],
    duration: 2000
  }
};

export async function playAnimation(message, effectType, target) {
  const effect = AnimationEffects[effectType];
  if (!effect) return;

  const animation = effect.animation;
  const msg = await message.channel.send(`${effect.prefix} ${animation[0]}`);

  for (let i = 1; i < animation.length; i++) {
    await new Promise(resolve => setTimeout(resolve, effect.duration / animation.length));
    await msg.edit(`${effect.prefix} ${animation[i]} ${target ? `→ ${target}` : ''}`);
  }

  setTimeout(() => msg.delete(), 1000);
}