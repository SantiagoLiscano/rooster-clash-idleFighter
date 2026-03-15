import { Color, Name } from '@/types/core';
import type { Fighter, FighterArchetypes, FighterStats } from '@/types/fighter';

export const diccionarioColores: (Color & Name)[] = [
  { color: '#FFCB05', name: 'Amarillo Eléctrico' },
  { color: '#3466AF', name: 'Azul Rey' },
  { color: '#6890F0', name: 'Azul Celeste' },
  { color: '#FF0000', name: 'Rojo Fuego' },
  { color: '#CC0000', name: 'Carmesí' },
  { color: '#78C850', name: 'Verde Hoja' },
  { color: '#49896F', name: 'Verde Bosque' },
  { color: '#C5915D', name: 'Marrón Claro' },
  { color: '#8B4513', name: 'Marrón Óxido' },
  { color: '#A040A0', name: 'Púrpura Veneno' },
  { color: '#7C6EBB', name: 'Morado Fantasma' },
  { color: '#F85888', name: 'Rosa Hada' },
  { color: '#FFB6C1', name: 'Rosa Claro' },
  { color: '#A9A9A9', name: 'Gris Plata' },
  { color: '#5B6370', name: 'Gris Acero' },
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
  return {
    id,
    name,
    rarity,
    archetype,
    level,
    xp,
    color: getRandomColor(),
    ...archetypes[archetype],
  };
}

export const starterRoster: Fighter[] = [
  createFighter({
    id: 'golden-rooster',
    name: 'Gallo de Oro',
    rarity: 'common',
    archetype: 'balanced',
  }),
  createFighter({
    id: 'iron-beak',
    name: 'Pico de Hierro',
    rarity: 'common',
    archetype: 'tank',
  }),
  createFighter({
    id: 'swift-shadow',
    name: 'Sombra Fugaz',
    rarity: 'rare',
    archetype: 'agile',
  }),
];

export const rivalPool: string[] = [
  'Fuero Negro',
  'Pluma Roja',
  'Espolón Letal',
  'Ciclón',
  'El Verdugo',
  'Navaja Blindada',
  'Cresta Rota',
];

export function cloneRoster<T extends Fighter>(roster: T[]): T[] {
  return structuredClone(roster);
}
