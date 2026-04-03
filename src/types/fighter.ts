import type { Color, Entity, Name } from './core';

/**
 * Hit points value for fighters and combatants.
 */
export type Hp = {
  /** Current hit points (0-100 typically) */
  hp: number;
};

/**
 * Maximum hit points capacity for fighters and combatants.
 */
export type MaxHp = {
  /** Maximum hit points capacity (typically 50-200) */
  maxHp: number;
};

/**
 * Available fighter archetypes that define combat style.
 */
export type FighterArchetypes =
  | 'balanced' /** Balanced attack/defense/speed */
  | 'tank' /** High defense, low speed */
  | 'agile' /** High speed, high dodge */
  | 'aggressive' /** High attack, low defense */
  | 'technical'; /** High crit, relies on precision */

/**
 * Core combat statistics for fighters.
 * Higher values = better performance in battles.
 */
export type FighterStats = {
  /** Base damage dealt per attack (1-100) */
  attack: number;
  /** Damage reduction percentage (0-100) */
  defense: number;
  /** Determines turn order (higher = first) (1-100) */
  speed: number;
  /** Critical hit bonus percentage (0-50) */
  critBonus: number;
  /** Dodge chance percentage (0-50) */
  dodgeBonus: number;
  /** Block chance percentage (0-50) */
  blockBonus: number;
  /** Attack damage variance (± percentage) (0-30) */
  variance: number;
} & Hp;

/**
 * Rarity tiers for fighters. Affects drop rates and power.
 */
export type FighterRarity = 'common' | 'rare' | 'enemy';

/**
 * Complete fighter entity with all stats and metadata.
 * Used in roster, battles, and persistence.
 */
export interface Fighter extends Entity, Name, FighterStats, Color, MaxHp {
  /** Rarity tier determining strength and availability */
  rarity: FighterRarity;
  /** Combat archetype defining stat distribution */
  archetype: FighterArchetypes;
  /** Current level (1-99) */
  level: number;
  /** Experience points toward next level */
  xp: number;
}

/**
 * Fighter instance in active battle with potential HP override.
 * Extends Fighter for battle-specific HP tracking.
 */
export type Combatant = Fighter;
