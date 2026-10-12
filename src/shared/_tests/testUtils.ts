/**
 * Shared testing utilities for battle and game tests.
 * Provides factory functions for creating mock game objects with sensible defaults.
 */

import { ActionCtx } from "../../types/events/actionCtx.ts";
import { EnemyType, PlayerType } from "../../types/individual/characters.ts";
import { StatsType } from "../../types/individual/stats.ts";
import { ManeuverType } from "../../types/equipables/maneuvers.ts";
import {
  BattleGrade,
  GameType,
  LobbyStatus,
  Victor,
} from "../../types/game.ts";
import { ConnectionType } from "../../types/server.ts";
import { WeaponName } from "../../types/equipables/weapons.ts";
import { ArmorName } from "../../types/equipables/armors.ts";
import { BlessingName } from "../../types/equipables/blessings.ts";
import { EnchantmentName } from "../../types/equipables/enchantments.ts";

/**
 * Creates a blank stats object with all values set to 0 or minimal defaults.
 * Useful as a base for stat modifications in tests.
 */
export const blankStats = (): StatsType => ({
  core: {
    vitality: 20,
    life: 100,
    maxLife: 100,
    initiative: 20,
    speed: 20,
    maxSpeed: 20,
  },
  discipline: {
    martial: 0,
    mystic: 0,
    defense: 0,
    resistance: 0,
    precision: 0,
    control: 0,
    dodge: 0,
    negation: 0,
  },
  mastery: {
    bladed: 0,
    blunt: 0,
    elemental: 0,
    psychic: 0,
    plating: 0,
    padding: 0,
    dampening: 0,
    warding: 0,
  },
});

/**
 * Creates a player character with default values that can be overridden.
 * Commonly used in tests to set up attacker/defender scenarios.
 *
 * @param id - Unique identifier for the player
 * @param overridesOrEnchantments - Either:
 *   - An array of enchantment strings (convenience for common case)
 *   - A partial player object to override defaults
 * @param blessings - Optional array of blessing strings
 * @param weapon - Optional weapon name
 * @param armor - Optional armor name
 * @returns A complete PlayerType object with defaults applied
 *
 * @example
 * // Using enchantments directly
 * const player = makePlayer("attacker", ["sharpen the blade"]);
 *
 * // Using overrides object
 * const player = makePlayer("attacker", {
 *   equipped: { weapon: "cutlass", armor: null, blessings: [], enchantments: [] }
 * });
 *
 * // Using individual equipable parameters
 * const player = makePlayer("attacker", ["sharpen the blade"], ["eternal flame"], "cutlass", "leather");
 */
export const makePlayer = (
  id: string,
  overridesOrEnchantments?: EnchantmentName[] | Partial<PlayerType>,
  blessings?: BlessingName[],
  weapon?: WeaponName | null,
  armor?: ArmorName | null,
): PlayerType => {
  // Determine if second parameter is enchantments array or overrides object
  let overrides: Partial<PlayerType> = {};
  let enchantments: EnchantmentName[] = [];

  if (Array.isArray(overridesOrEnchantments)) {
    // Second parameter is an array of enchantments
    enchantments = overridesOrEnchantments;
  } else if (overridesOrEnchantments) {
    // Second parameter is an overrides object
    overrides = overridesOrEnchantments;
  }

  // Build the equipped object, preferring direct parameters, then overrides, then defaults
  const baseEquipped = overrides.equipped as
    | Partial<PlayerType["equipped"]>
    | undefined;
  const finalEquipped: PlayerType["equipped"] = {
    weapon: weapon ?? baseEquipped?.weapon ?? null,
    armor: armor ?? baseEquipped?.armor ?? null,
    blessings: blessings ?? baseEquipped?.blessings ?? [],
    enchantments:
      enchantments.length > 0
        ? enchantments
        : (baseEquipped?.enchantments ?? []),
  };

  return {
    id,
    name: id,
    userId: id,
    team: "player",
    loadout: {
      armors: [],
      blessings: [],
      enchantments: [],
      maneuvers: ["headbutt"],
      weapons: ["cutlass"],
    },
    stats: blankStats(),
    effects: {},
    lastTurn: 0,
    isDead: false,
    pending: {
      armors: 0,
      blessings: 0,
      enchantments: 0,
      maneuvers: 0,
      weapons: 0,
      core: 0,
      discipline: 0,
      mastery: 0,
      prepare: 0,
    },
    private: {
      queue: {
        armors: [],
        blessings: [],
        enchantments: [],
        maneuvers: [],
        weapons: [],
      },
      savedStats: blankStats(),
    },
    ...overrides,
    equipped: finalEquipped,
  };
};
/**
 * Creates an enemy character with default values that can be overridden.
 * Typically used in tests for enemy AI and attack scenarios.
 *
 * @param id - Unique identifier for the enemy
 * @param overridesOrEnchantments - Either:
 *   - An array of enchantment strings (convenience for common case)
 *   - A partial enemy object to override defaults
 * @param blessings - Optional array of blessing strings
 * @param weapon - Optional weapon name
 * @param armor - Optional armor name
 * @returns A complete EnemyType object with defaults applied
 *
 * @example
 * const enemy = makeEnemy("shroomlet");
 * const enemy = makeEnemy("shroomlet", ["blessing1"]);
 */
export const makeEnemy = (
  id: string,
  overridesOrEnchantments?: EnchantmentName[] | Partial<EnemyType>,
  blessings?: BlessingName[],
  weapon?: WeaponName | null,
  armor?: ArmorName | null,
): EnemyType => {
  // Determine if second parameter is enchantments array or overrides object
  let overrides: Partial<EnemyType> = {};
  let enchantments: EnchantmentName[] = [];

  if (Array.isArray(overridesOrEnchantments)) {
    enchantments = overridesOrEnchantments;
  } else if (overridesOrEnchantments) {
    overrides = overridesOrEnchantments;
  }

  // Build the equipped object, preferring direct parameters, then overrides, then defaults
  const baseEquipped = overrides.equipped as
    | Partial<EnemyType["equipped"]>
    | undefined;
  const finalEquipped: EnemyType["equipped"] = {
    weapon: weapon ?? baseEquipped?.weapon ?? "cutlass",
    armor: armor ?? baseEquipped?.armor ?? null,
    blessings: blessings ?? baseEquipped?.blessings ?? [],
    enchantments:
      enchantments.length > 0
        ? enchantments
        : (baseEquipped?.enchantments ?? []),
  };

  return {
    id,
    name: id,
    team: "enemy",
    loadout: {
      armors: [],
      blessings: [],
      enchantments: [],
      maneuvers: ["bonk", "pass"],
      weapons: [],
    },
    stats: blankStats(),
    effects: {},
    lastTurn: 0,
    isDead: false,
    ...overrides,
    equipped: finalEquipped,
  };
};

/**
 * Creates an action context (ActionCtx) with default values that can be overridden.
 * Used in tests to simulate battle actions and their effects.
 *
 * @param overrides - Partial action context object to override defaults
 * @returns A complete ActionCtx object with defaults applied
 *
 * @example
 * const ctx = makeCtx({
 *   sourceId: "attacker",
 *   targetIds: ["target"],
 *   instance: new Map([["target", { damage: 10, mitigation: 0, heal: 0, evaded: false }]])
 * });
 */
export const makeCtx = (overrides: Partial<ActionCtx> = {}): ActionCtx => ({
  characters: {},
  sourceId: "attacker",
  targetIds: [],
  maneuver: {} as ManeuverType,
  speed: 0,
  speedElapsed: 0,
  messages: { headline: "", steps: [] },
  toHit: 0,
  accuracy: 0,
  instance: new Map(),
  heal: 0,
  round: 0,
  previousResults: [],
  ...overrides,
});

/**
 * Creates a game object with default values.
 * Used in tests to simulate complete game state scenarios.
 *
 * @param attacker - The attacking enemy character
 * @param target - The target player character
 * @returns A complete GameType object ready for battle
 *
 * @example
 * const game = makeGame(makeEnemy("enemy"), makePlayer("player"));
 */
export const makeGame = (
  attacker: EnemyType,
  target: PlayerType,
): GameType => ({
  battle: {
    grade: BattleGrade.MINOR,
    isFresh: false,
    messages: [],
    round: 1,
    speedElapsed: 0,
    turnOrder: [attacker.id],
    victor: Victor.NONE,
  },
  characters: { [attacker.id]: attacker, [target.id]: target },
  lobby: {
    gameId: "game-1",
    status: LobbyStatus.BATTLE,
    pastEncounters: 0,
    users: [],
    votes: [],
    errorMessage: undefined,
  },
});

/**
 * Creates a connection object (server connection mock) for testing.
 * Provides a mock socket.io connection with a games map.
 *
 * @param game - The game object to attach to the connection
 * @param userId - Optional userId to mock in socket.rooms (for player turn validation)
 * @returns A mock ConnectionType object
 *
 * @example
 * const connection = makeConnection(game, "player-1");
 * handleTurn(connection, turn);
 */
export const makeConnection = (
  game: GameType,
  userId?: string,
): ConnectionType => {
  const games = new Map<string, GameType>();
  games.set("game-1", game);

  const rooms = new Set<string>(["game-1"]);
  if (userId) {
    rooms.add(userId);
  }

  return {
    meta: { games },
    io: { to: () => ({ emit: () => {} }) } as never,
    socket: {
      rooms,
      emit: () => {},
    } as never,
  };
};
