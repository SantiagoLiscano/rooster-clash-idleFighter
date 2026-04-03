import { randomInt, shuffle } from './utils';
import { archetypes, getRandomColor, rivalPool } from '../data/characters';

import type { Fighter, FighterArchetypes } from '@/types/fighter';

const rivalArchetypes: Array<FighterArchetypes> = [
  'balanced',
  'tank',
  'agile',
  'aggressive',
  'technical',
];

type RivalArchetype = (typeof rivalArchetypes)[number];

export function generateOpponents(count = 2): Fighter[] {
  return shuffle(rivalPool)
    .slice(0, count)
    .map((name, index) => {
      const archetype: RivalArchetype =
        rivalArchetypes[index % rivalArchetypes.length];
      const template = archetypes[archetype];
      const swing = () => randomInt(-4, 4);
      const baseHp = template.hp + swing();

      return {
        id: `rival-${index}-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name,
        rarity: 'enemy',
        archetype,
        level: randomInt(1, 4),
        xp: 0,
        hp: baseHp,
        maxHp: baseHp,
        attack: template.attack + swing(),
        defense: template.defense + swing(),
        speed: template.speed + swing(),
        color: getRandomColor(), // <-- Color inyectado
        critBonus: template.critBonus,
        dodgeBonus: template.dodgeBonus,
        blockBonus: template.blockBonus,
        variance: template.variance,
      };
    });
}
