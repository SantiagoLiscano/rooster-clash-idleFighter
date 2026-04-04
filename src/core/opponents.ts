import { shuffle } from './utils';
import { createFighter, rivalPool } from '../data/characters';

import type { Fighter, FighterArchetypes } from '@/types/fighter';

const rivalArchetypes: Array<FighterArchetypes> = [
  'balanced',
  'tank',
  'agile',
  'aggressive',
  'technical',
];

export function generateOpponents(count = 2): Fighter[] {
  const shuffledNames = shuffle(rivalPool);

  return Array.from({ length: count }).map((_, index) => {
    const name = shuffledNames[index % shuffledNames.length];
    const archetype =
      rivalArchetypes[Math.floor(Math.random() * rivalArchetypes.length)];

    const level = Math.floor(Math.random() * 3) + 1; // 1 to 3

    return createFighter({
      id: `rival-${index}-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      rarity: 'enemy',
      archetype,
      level,
    });
  });
}
