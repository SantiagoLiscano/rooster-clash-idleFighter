import type { Entity } from './core';
import type { Combatant, Fighter } from './fighter';
import { GenericType } from './generics';

/**
 * Player/opponent distinction for UI and logic.
 */
export type PlayerSide = 'player' | 'opponent';

/**
 * Object containing playerSide property.
 */
export type PlayerSideConfig = { playerSide: PlayerSide };

/**
 * Fighters mapped by player/opponent side.
 */
export type PlayerBySide = Record<PlayerSide, Fighter>;

/**
 * Types of visual and gameplay effects during battle.
 */
export type BattleEffectType = 'dodge' | 'shield' | 'claws';

/**
 * Battle effect targeting a specific arena side.
 * Can be null (no active effect).
 */
export type BattleEffect =
  | ({
      /** Target side for the effect */
      target: PlayerSide;
    } & GenericType<BattleEffectType>)
  | null;

/**
 * Image assets for both battle sides.
 */
export type BattleImages = Record<PlayerSide, string>;

/**
 * Complete battle state snapshot.
 * Used for rendering and battle logic.
 */
export type BattleState = {
  /** Left side combatant */
  left: Combatant;
  /** Right side combatant */
  right: Combatant;
  /** Current visual assets */
  images: BattleImages;
  /** Active battle effect (if any) */
  effect: BattleEffect;
  /** Current battle mode text (attack/defend/wait) */
  modeText: string;
};

/**
 * Battle log entry types for different message categories.
 */
export type BattleLogEntryType = 'default' | 'system' | 'turn' | 'winner';

/**
 * Single battle log entry with categorized message.
 * Persisted for battle history and replay.
 */
export interface BattleLogEntry
  extends Entity, GenericType<BattleLogEntryType> {
  /** Log message text */
  message: string;
}
