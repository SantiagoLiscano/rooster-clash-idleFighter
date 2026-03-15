import { getRandomColor } from '../data/characters';

import type { Fighter } from '@/types/fighter';

const SAVE_KEY = 'rooster-clash:player-roster';

export function loadRoster(): Fighter[] | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as Array<Fighter & { colores?: string[] }>;
  // Migración retroactiva: asegura que todos los gallos guardados tengan un color único
  return parsed.map((f) => ({
    ...f,
    color:
      f.color ||
      (Array.isArray(f.colores) && f.colores.length > 0
        ? f.colores[0]
        : getRandomColor()),
  }));
}

export function saveRoster(roster: Fighter[]): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(roster));
}
export function clearRoster(): void {
  localStorage.removeItem(SAVE_KEY);
}
export function hasSavedRoster(): boolean {
  return Boolean(loadRoster());
}
