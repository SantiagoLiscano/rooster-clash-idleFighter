import { BattleLogEntry, BattleState, PlayerSideConfig } from './battle';
import { Color } from './core';
import type { Combatant, Fighter } from './fighter';
import { GenericType } from './generics';

/**
 * Props for fighter selection card in roster screen.
 */
export type FighterCardProps = {
  /** Fighter data to display */
  fighter: Fighter;
  /** Is this fighter currently selected */
  isSelected: boolean;
  /** Callback when fighter is clicked */
  onSelect: () => void;
  /** Optional color editor callback */
  onEditColor?: () => void;
  /** Show XP bar or not */
  showXp?: boolean;
} & PlayerSideConfig;

/**
 * Props for fighter panel in battle arena.
 */
export type FighterPanelProps = {
  /** Fighter with optional current HP */
  fighter: Combatant;
  /** Fighter image URL */
  image: string;
  /** Active effect name or null */
  effect: string | null;
} & PlayerSideConfig;

/**
 * Props for color customization modal.
 */
export type ColorEditorModalProps = {
  /** Fighter being edited (null = closed) */
  fighter: Fighter | undefined;
  /** Close modal callback */
  onClose: () => void;
  /** Save new color callback */
  onSave: (fighterId: string, color: string) => void;
};

/**
 * Props for main menu screen.
 */
export type MenuScreenProps = {
  /** Start new game callback */
  onNewGame: () => void;
  /** Continue saved game callback */
  onContinue: () => void;
  /** Is continue button enabled */
  canContinue: boolean;
  /** Save file status text */
  saveStatus: string;
};

/**
 * Props for fighter selection screen.
 */
export type SelectionScreenProps = {
  /** Available player fighters */
  rooster: Fighter[];
  /** Generated opponent fighters */
  opponents: Fighter[];
  /** Currently selected player fighter ID */
  selectedPlayerId: string | null;
  /** Currently selected opponent fighter ID */
  selectedOpponentId: string | null;
  /** Go back to menu callback */
  onBack: () => void;
  /** Refresh opponent list callback */
  onRefreshOpponents: () => void;
  /** Select player fighter callback */
  onSelectPlayer: (id: string) => void;
  /** Select opponent fighter callback */
  onSelectOpponent: (id: string) => void;
  /** Start battle callback */
  onStartBattle: () => void;
  /** Can start button enabled state */
  canStartBattle: boolean;
  /** Open color editor callback */
  onOpenColorEditor: (id: string) => void;
};

/**
 * Props for main battle arena screen.
 */
export type BattleArenaProps = {
  /** Current battle state */
  battleState: BattleState;
  /** Complete battle log history */
  battleLog: BattleLogEntry[];
  /** Return to roster selection */
  onBackToRoster: () => void;
  /** Surrender current battle */
  onSurrender: () => void;
  /** Can surrender flag */
  canSurrender: boolean;
  /** Battle finished state */
  isFinished: boolean;
};

/**
 * Props for visual rooster (gallo) component.
 */
export type VisualGalloProps = {
  /** Render on right side (flipped) */
  isRight?: boolean;
} & GenericType<string> &
  Partial<Color>;
