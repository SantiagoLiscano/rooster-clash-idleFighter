import { getRandomColor } from '../data/characters';

import type { Fighter } from '@/types/fighter';

const SAVE_KEY = 'rooster-clash:player-roster';

export interface GameState {
  roster: Fighter[];
  opponents?: Fighter[];
  lastRefreshDate?: string;
  icuTimestamp?: number;
}

export function loadGame(): GameState | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as unknown;

  if (Array.isArray(parsed)) {
    const rawRoster = parsed as Array<Fighter & { colores?: string[] }>;
    return {
      roster: rawRoster.map((f) => ({
        ...f,
        color:
          f.color ||
          (Array.isArray(f.colores) && f.colores.length > 0
            ? f.colores[0]
            : getRandomColor()),
        maxHp: f.maxHp ?? f.hp,
      })),
    };
  }

  const state = parsed as GameState;
  return {
    ...state,
    roster: (state.roster || []).map((f) => ({
      ...f,
      maxHp: f.maxHp ?? f.hp,
    })),
  };
}

export function saveGame(state: GameState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function clearGame(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function hasSavedGame(): boolean {
  return Boolean(loadGame());
}
