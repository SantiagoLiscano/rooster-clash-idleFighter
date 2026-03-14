/**
 * Base entity interface for all game objects.
 * Provides unique identification.
 */
export type Entity = {
  /** Unique identifier (UUID or generated string) */
  id: string;
};

/**
 * Common naming interface for named game objects.
 */
export type Name = {
  /** Display name of the entity */
  name: string;
};

/**
 * Color definition for fighter customization and visuals.
 */
export type Color = {
  /** Hex color code or CSS color name (e.g. "#FF5733", "red") */
  color: string;
};

