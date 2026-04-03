import { Color, Name } from '@/types/core';
import type { Fighter, FighterArchetypes, FighterStats } from '@/types/fighter';

export const diccionarioColores: (Color & Name)[] = [
  { color: '#FFCB05', name: 'Electric Yellow' },
  { color: '#3466AF', name: 'Royal Blue' },
  { color: '#6890F0', name: 'Sky Blue' },
  { color: '#FF0000', name: 'Fire Red' },
  { color: '#CC0000', name: 'Crimson' },
  { color: '#78C850', name: 'Leaf Green' },
  { color: '#49896F', name: 'Forest Green' },
  { color: '#C5915D', name: 'Light Brown' },
  { color: '#8B4513', name: 'Rust Brown' },
  { color: '#A040A0', name: 'Poison Purple' },
  { color: '#7C6EBB', name: 'Phantom Purple' },
  { color: '#F85888', name: 'Fairy Pink' },
  { color: '#FFB6C1', name: 'Light Pink' },
  { color: '#A9A9A9', name: 'Silver Grey' },
  { color: '#5B6370', name: 'Steel Grey' },
];

export function getRandomColor(): string {
  return diccionarioColores[
    Math.floor(Math.random() * diccionarioColores.length)
  ].color;
}

export const archetypes: Record<FighterArchetypes, FighterStats> = {
  balanced: {
    hp: 105,
    attack: 70,
    defense: 68,
    speed: 67,
    critBonus: 0.01,
    dodgeBonus: 0.01,
    blockBonus: 0.02,
    variance: 0.04,
  },
  tank: {
    hp: 118,
    attack: 58,
    defense: 84,
    speed: 50,
    critBonus: 0,
    dodgeBonus: 0,
    blockBonus: 0.08,
    variance: 0.03,
  },
  agile: {
    hp: 96,
    attack: 78,
    defense: 54,
    speed: 82,
    critBonus: 0.03,
    dodgeBonus: 0.06,
    blockBonus: 0,
    variance: 0.06,
  },
  aggressive: {
    hp: 101,
    attack: 82,
    defense: 56,
    speed: 71,
    critBonus: 0.05,
    dodgeBonus: 0.01,
    blockBonus: -0.01,
    variance: 0.08,
  },
  technical: {
    hp: 103,
    attack: 67,
    defense: 71,
    speed: 69,
    critBonus: 0.02,
    dodgeBonus: 0.02,
    blockBonus: 0.04,
    variance: 0.02,
  },
};

function createFighter({
  id,
  name,
  rarity,
  archetype,
  level = 1,
  xp = 0,
}: Pick<Fighter, 'id' | 'name' | 'rarity' | 'archetype'> &
  Pick<Partial<Fighter>, 'level' | 'xp'>): Fighter {
  const baseStats = { ...archetypes[archetype] };

  // 1. Rarity multiplier for base stats
  const rarityMult = rarity === 'rare' ? 1.15 : rarity === 'enemy' ? 1.05 : 1.0;
  baseStats.hp = Math.round(baseStats.hp * rarityMult);
  baseStats.attack = Math.round(baseStats.attack * rarityMult);
  baseStats.defense = Math.round(baseStats.defense * rarityMult);
  baseStats.speed = Math.round(baseStats.speed * rarityMult);

  // 2. Strong variability trade-offs between Attack, Defense, and Speed
  // We perform 2 exchanges of up to 20 points, allowing up to 40 points difference.
  const tradeStats = ['attack', 'defense', 'speed'] as const;
  for (let i = 0; i < 2; i++) {
    const fromStat = tradeStats[Math.floor(Math.random() * 3)];
    let toStat = tradeStats[Math.floor(Math.random() * 3)];
    while (toStat === fromStat) {
      toStat = tradeStats[Math.floor(Math.random() * 3)];
    }

    const shift = Math.floor(Math.random() * 21); // 0 to 20 points traded
    if (baseStats[fromStat] - shift >= 10) {
      // ensure no stat completely drops to 0
      baseStats[fromStat] -= shift;
      baseStats[toStat] += shift;
    }
  }

  // 3. Small HP variance (+/- archetype variance)
  const hpVariance = baseStats.hp * baseStats.variance;
  baseStats.hp += Math.round((Math.random() * 2 - 1) * hpVariance);

  return {
    id,
    name,
    rarity,
    archetype,
    level,
    xp,
    color: getRandomColor(),
    ...baseStats,
    maxHp: baseStats.hp,
  };
}

export const starterRoster: Fighter[] = [
  createFighter({
    id: 'golden-rooster',
    name: 'Golden Rooster',
    rarity: 'common',
    archetype: 'balanced',
  }),
  createFighter({
    id: 'iron-beak',
    name: 'Iron Beak',
    rarity: 'common',
    archetype: 'tank',
  }),
  createFighter({
    id: 'swift-shadow',
    name: 'Swift Shadow',
    rarity: 'rare',
    archetype: 'agile',
  }),
];

export const rivalPool: string[] = [
  'Black Fury',
  'Red Feather',
  'Lethal Spur',
  'Cyclone',
  'The Executioner',
  'Armored Blade',
  'Broken Crest',
];

export function cloneRoster<T extends Fighter>(roster: T[]): T[] {
  return structuredClone(roster);
}
