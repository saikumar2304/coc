import { CardType, EffectType } from "../constants/cardTypes.js";

export const cards = [
  // Attack + Heal Cards (Hybrid)
  {
    id: 1,
    name: "Vampire Strike",
    type: CardType.HYBRID,
    effects: [
      { type: EffectType.DAMAGE, value: 20 },
      { type: EffectType.HEAL, value: 15 },
    ],
    description: "Deal 20 damage and recover 15 HP",
    imageUrl: "vampire-strike.png",
    rarity: "common",
  },
  {
    id: 2,
    name: "Blazing Slash",
    type: CardType.HYBRID,
    effects: [
      { type: EffectType.DAMAGE, value: 25 },
      { type: EffectType.HEAL, value: 10 },
    ],
    description: "Deal 25 damage and recover 10 HP",
    imageUrl: "blazing-slash.png",
    rarity: "common",
  },
  {
    id: 3,
    name: "Radiant Blow",
    type: CardType.HYBRID,
    effects: [
      { type: EffectType.DAMAGE, value: 15 },
      { type: EffectType.HEAL, value: 20 },
    ],
    description: "Deal 15 damage and recover 20 HP",
    imageUrl: "radiant-blow.png",
    rarity: "common",
  },
  {
    id: 4,
    name: "Shadow Fang",
    type: CardType.HYBRID,
    effects: [
      { type: EffectType.DAMAGE, value: 30 },
      { type: EffectType.HEAL, value: 15 },
    ],
    description: "Deal 30 damage and recover 15 HP",
    imageUrl: "shadow-fang.png",
    rarity: "uncommon",
  },
  {
    id: 5,
    name: "Dragon's Bite",
    type: CardType.HYBRID,
    effects: [
      { type: EffectType.DAMAGE, value: 35 },
      { type: EffectType.HEAL, value: 25 },
    ],
    description: "Deal 35 damage and recover 25 HP",
    imageUrl: "dragons-bite.png",
    rarity: "rare",
  },
  // Pure Attack Cards
  {
    id: 6,
    name: "Lightning Strike",
    type: CardType.ATTACK,
    effects: [
      { type: EffectType.DAMAGE, value: 35 },
      // { type: EffectType.DRAW, value: 1 },
    ],
    description: "Deal 35 damage",
    imageUrl: "lightning-strike.png",
    rarity: "common",
  },
  {
    id: 7,
    name: "Inferno Blast",
    type: CardType.ATTACK,
    effects: [{ type: EffectType.DAMAGE, value: 45 }],
    description: "Deal 45 damage",
    imageUrl: "inferno-blast.png",
    rarity: "uncommon",
  },
  {
    id: 8,
    name: "Meteor Strike",
    type: CardType.ATTACK,
    effects: [{ type: EffectType.DAMAGE, value: 50 }],
    description: "Deal 50 damage",
    imageUrl: "meteor-strike.png",
    rarity: "rare",
  },
  {
    id: 9,
    name: "Thunder Bolt",
    type: CardType.ATTACK,
    effects: [
      { type: EffectType.DAMAGE, value: 30 },
      { type: EffectType.DISABLE_HEALING, value: 1 },
    ],
    description: "Deal 30 damage and disable healing for 1 turn",
    imageUrl: "thunder-bolt.png",
    rarity: "uncommon",
  },
  {
    id: 10,
    name: "Ice Shard",
    type: CardType.ATTACK,
    effects: [
      { type: EffectType.DAMAGE, value: 25 },
      { type: EffectType.WEAKEN, value: 10 },
    ],
    description: "Deal 25 damage and weaken next attack by 10",
    imageUrl: "ice-shard.png",
    rarity: "common",
  },
  // Pure Healing Cards
  {
    id: 11,
    name: "Minor Heal",
    type: CardType.HEAL,
    effects: [{ type: EffectType.HEAL, value: 25 }],
    description: "Recover 25 HP",
    imageUrl: "minor-heal.png",
    rarity: "common",
  },
  {
    id: 12,
    name: "Greater Heal",
    type: CardType.HEAL,
    effects: [{ type: EffectType.HEAL, value: 35 }],
    description: "Recover 35 HP",
    imageUrl: "greater-heal.png",
    rarity: "common",
  },
  {
    id: 13,
    name: "Holy Light",
    type: CardType.HEAL,
    effects: [{ type: EffectType.HEAL, value: 45 }],
    description: "Recover 45 HP",
    imageUrl: "holy-light.png",
    rarity: "uncommon",
  },
  {
    id: 14,
    name: "Divine Blessing",
    type: CardType.HEAL,
    effects: [
      { type: EffectType.HEAL, value: 30 },
      { type: EffectType.IMMUNITY, value: 1 },
    ],
    description: "Recover 30 HP and gain immunity for 1 turn",
    imageUrl: "divine-blessing.png",
    rarity: "rare",
  },
  {
    id: 15,
    name: "Nature's Touch",
    type: CardType.HEAL,
    effects: [
      { type: EffectType.HEAL, value: 20 },
      // { type: EffectType.DRAW, value: 1 },
    ],
    description: "Recover 20 HP and draw a card",
    imageUrl: "natures-touch.png",
    rarity: "common",
  },
  // Special Effect Cards
  {
    id: 16,
    name: "Shield Wall",
    type: CardType.SPECIAL,
    effects: [{ type: EffectType.IMMUNITY, value: 1 }],
    description: "Gain immunity for 1 turn",
    imageUrl: "shield-wall.png",
    rarity: "uncommon",
  },
  {
    id: 17,
    name: "Life Drain",
    type: CardType.SPECIAL,
    effects: [{ type: EffectType.DRAIN, value: 25 }],
    description: "Drain 25 HP from target",
    imageUrl: "life-drain.png",
    rarity: "rare",
  },
  {
    id: 18,
    name: "Time Warp",
    type: CardType.SPECIAL,
    effects: [{ type: EffectType.EXTRA_TURN, value: 1 }],
    description: "Take an extra turn",
    imageUrl: "time-warp.png",
    rarity: "rare",
  },
  {
    id: 19,
    name: "Mirror Shield",
    type: CardType.SPECIAL,
    effects: [{ type: EffectType.REFLECT, value: 1 }],
    description: "Reflect next attack back to attacker",
    imageUrl: "mirror-shield.png",
    rarity: "rare",
  },
  {
    id: 20,
    name: "Energy Boost",
    type: CardType.SPECIAL,
    effects: [{ type: EffectType.BOOST_NEXT, value: 15 }],
    description: "Boost next attack by 15 damage",
    imageUrl: "energy-boost.png",
    rarity: "uncommon",
  },
  // Chaos Cards
  {
    id: 21,
    name: "Chaos Surge",
    type: CardType.CHAOS,
    effects: [
      { type: EffectType.DAMAGE, value: 50 },
      { type: EffectType.SELF_DAMAGE, value: 20 },
    ],
    description: "Deal 50 damage but take 20 damage yourself",
    imageUrl: "chaos-surge.png",
    rarity: "rare",
  },
  {
    id: 22,
    name: "Health Exchange",
    type: CardType.CHAOS,
    effects: [{ type: EffectType.SWAP_HEALTH, value: 1 }],
    description: "Swap HP with target",
    imageUrl: "health-exchange.png",
    rarity: "rare",
  },
  {
    id: 23,
    name: "Wild Magic",
    type: CardType.CHAOS,
    effects: [{ type: EffectType.MASS_DAMAGE, value: 20 }],
    description: "Deal 20 damage to all players (including yourself)",
    imageUrl: "wild-magic.png",
    rarity: "rare",
  },
  {
    id: 24,
    name: "Dark Pact",
    type: CardType.CHAOS,
    effects: [
      { type: EffectType.DAMAGE, value: 40 },
      { type: EffectType.SELF_DAMAGE, value: 10 },
      // { type: EffectType.DRAW, value: 2 },
    ],
    description: "Deal 40 damage, take 10 damage",
    imageUrl: "dark-pact.png",
    rarity: "rare",
  },
  {
    id: 25,
    name: "Unstable Power",
    type: CardType.CHAOS,
    effects: [
      { type: EffectType.DAMAGE, value: 35 },
      { type: EffectType.MASS_DAMAGE, value: 15, exclude: "target" },
    ],
    description: "Deal 35 damage to target and 15 to all players",
    imageUrl: "unstable-power.png",
    rarity: "rare",
  },
  // Combo Cards
  {
    id: 26,
    name: "Double Strike",
    type: CardType.ATTACK,
    effects: [
      { type: EffectType.DAMAGE, value: 20 },
      { type: EffectType.EXTRA_TURN, value: 1 },
    ],
    description: "Deal 20 damage and take another turn",
    imageUrl: "double-strike.png",
    rarity: "rare",
  },
  {
    id: 27,
    name: "Chain Lightning",
    type: CardType.ATTACK,
    effects: [
      { type: EffectType.DAMAGE, value: 30 },
      {
        type: EffectType.MULTI_TARGET,
        value: 15,
        DamageNextRound: true,
        damageReason:
          "{playerName} Chain Lightning strikes, dealing {damage} damage to {target}!",
      },
    ],
    description: "Deal 30 damage to target and 15 to next player",
    imageUrl: "chain-lightning.png",
    rarity: "uncommon",
  },
  {
    id: 28,
    name: "Soul Link",
    type: CardType.SPECIAL,
    effects: [
      { type: EffectType.DRAIN, value: 20 },
      // { type: EffectType.ALLY_HEAL, value: 10 },
    ],
    description: "Drain 20 HP and heal previous player for 10",
    imageUrl: "soul-link.png",
    rarity: "uncommon",
  },
  {
    id: 29,
    name: "Judgment",
    type: CardType.SPECIAL,
    effects: [{ type: EffectType.JUDGMENT, above: 400, below: 40 }],
    description: "Instantly defeat target if their HP is below 40 or above 400",
    imageUrl: "judgment.png",
    rarity: "rare",
  },
  {
    id: 30,
    name: "Balance",
    type: CardType.SPECIAL,
    effects: [
      { type: EffectType.MASS_HEAL, value: 15 },
      { type: EffectType.MASS_DAMAGE, value: 15 },
    ],
    description: "Deal 15 damage and heal all players for 15",
    imageUrl: "balance.png",
    rarity: "rare",
  },
];

// Adjusted rarity distribution for better game balance
export const getRandomCard = () => {
  const randomValue = Math.random();
  let rarityPool;

  if (randomValue < 0.65) {
    // 65% chance for common
    rarityPool = cards.filter((card) => card.rarity === "common");
  } else if (randomValue < 0.9) {
    // 25% chance for uncommon
    rarityPool = cards.filter((card) => card.rarity === "uncommon");
  } else {
    // 10% chance for rare
    rarityPool = cards.filter((card) => card.rarity === "rare");
  }

  const randomIndex = Math.floor(Math.random() * rarityPool.length);
  return { ...rarityPool[randomIndex] };
};
