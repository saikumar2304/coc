export const ImageConfig = {
  basePath: '/images/cards',
  defaultImage: 'card-back.png',
  dimensions: {
    width: 512,
    height: 720
  },
  categories: {
    attack: 'attack',
    heal: 'heal',
    hybrid: 'hybrid',
    special: 'special',
    chaos: 'chaos'
  }
};

export const getCardImagePath = (card) => {
  if (!card || !card.imageUrl) return `${ImageConfig.basePath}/${ImageConfig.defaultImage}`;
  const category = card.type.toLowerCase();
  return `${ImageConfig.basePath}/${category}/${card.imageUrl}`;
};