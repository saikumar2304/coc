export const Elements = {
  FIRE: 'FIRE',
  WATER: 'WATER',
  EARTH: 'EARTH',
  AIR: 'AIR',
  LIGHT: 'LIGHT',
  DARK: 'DARK'
};

export const ElementalRelations = {
  FIRE: { strong: ['AIR', 'EARTH'], weak: ['WATER'] },
  WATER: { strong: ['FIRE', 'EARTH'], weak: ['AIR'] },
  EARTH: { strong: ['AIR', 'WATER'], weak: ['FIRE'] },
  AIR: { strong: ['WATER', 'EARTH'], weak: ['FIRE'] },
  LIGHT: { strong: ['DARK'], weak: [] },
  DARK: { strong: ['LIGHT'], weak: [] }
};

export const ElementalBonus = {
  ADVANTAGE: 1.5,    // 50% more damage
  DISADVANTAGE: 0.75 // 25% less damage
};