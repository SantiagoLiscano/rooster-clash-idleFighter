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
    attack: 72,
    defense: 72,
    speed: 72,
    critBonus: 0.01,
    dodgeBonus: 0.01,
    blockBonus: 0.02,
    variance: 0.04,
  },
  tank: {
    hp: 125,
    attack: 55,
    defense: 88,
    speed: 45,
    critBonus: 0,
    dodgeBonus: 0,
    blockBonus: 0.08,
    variance: 0.03,
  },
  agile: {
    hp: 92,
    attack: 75,
    defense: 50,
    speed: 90,
    critBonus: 0.03,
    dodgeBonus: 0.08,
    blockBonus: 0,
    variance: 0.05,
  },
  aggressive: {
    hp: 98,
    attack: 88,
    defense: 45,
    speed: 70,
    critBonus: 0.06,
    dodgeBonus: 0.01,
    blockBonus: -0.01,
    variance: 0.07,
  },
  technical: {
    hp: 100,
    attack: 65,
    defense: 82,
    speed: 62,
    critBonus: 0.02,
    dodgeBonus: 0.02,
    blockBonus: 0.05,
    variance: 0.02,
  },
};

export function createFighter({
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

  // 2. Randomized Primary Stat Selection for Specialization
  const tradeStats = ['attack', 'defense', 'speed'] as const;
  const primaryStat = tradeStats[Math.floor(Math.random() * 3)];

  // Apply Specialization Pass
  tradeStats.forEach((s) => {
    if (s === primaryStat) {
      // Bonus of +10 to +18 to the primary (half of previous +20 to +35)
      const bonus = 10 + Math.floor(Math.random() * 9);
      baseStats[s] += bonus;
    } else {
      // Penalty of -5 to -10 for secondary stats (half of previous -10 to -20)
      const penalty = 5 + Math.floor(Math.random() * 6);
      baseStats[s] = Math.max(20, baseStats[s] - penalty);
    }
  });

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

export function generateStarterRoster(): Fighter[] {
  const starterNames = [
    'Golden Rooster',
    'Iron Beak',
    'Swift Shadow',
    'Bold Claw',
    'Storm Wing',
  ];
  const archetypeValues = Object.keys(archetypes) as FighterArchetypes[];

  return [0, 1, 2].map((i) => {
    // Pick random archetype
    const archetype =
      archetypeValues[Math.floor(Math.random() * archetypeValues.length)];
    // Pick random name
    const name = starterNames[Math.floor(Math.random() * starterNames.length)];

    return createFighter({
      id: `starter-${i}-${Date.now()}`,
      name,
      rarity: i === 2 ? 'rare' : 'common',
      archetype,
    });
  });
}

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
