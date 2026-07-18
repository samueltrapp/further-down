import { describe, expect, it, vi } from "vitest";
import { handleTurn } from "../turnHandler.ts";
import { ConnectionType } from "../../../types/server.ts";
import {
  BattleGrade,
  GameType,
  LobbyStatus,
  Victor,
} from "../../../types/game.ts";
import { EnemyType, PlayerType } from "../../../types/individual/characters.ts";
import { StatsType } from "../../../types/individual/stats.ts";
import { EnemyTurnType } from "../../../types/events/turn.ts";
import { randNum } from "../../../shared/utils.ts";

vi.mock("../../../shared/utils.ts", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../../shared/utils.ts")>();
  return {
    ...actual,
    randNum: vi.fn(actual.randNum),
  };
});

const mockedRandNum = vi.mocked(randNum);

const blankStats = (): StatsType => ({
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

const makeEnemy = (
  id: string,
  overrides: Partial<EnemyType> = {},
): EnemyType => ({
  id,
  name: id,
  team: "enemy",
  equipped: { weapon: "cutlass", armor: null, blessings: [], enchantments: [] },
  loadout: {
    armors: [],
    blessings: [],
    enchantments: [],
    maneuvers: [],
    weapons: [],
  },
  stats: blankStats(),
  effects: {},
  burnSources: {},
  bleedSources: {},
  lastTurn: 0,
  isDead: false,
  ...overrides,
});

const makePlayer = (
  id: string,
  overrides: Partial<PlayerType> = {},
): PlayerType => ({
  id,
  name: id,
  userId: id,
  team: "player",
  equipped: { weapon: null, armor: "leather", blessings: [], enchantments: [] },
  loadout: {
    armors: [],
    blessings: [],
    enchantments: [],
    maneuvers: [],
    weapons: [],
  },
  stats: blankStats(),
  effects: {},
  burnSources: {},
  bleedSources: {},
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
});

const makeGame = (attacker: EnemyType, target: PlayerType): GameType => ({
  battle: {
    grade: BattleGrade.MINOR,
    isFresh: false,
    messages: [],
    round: 1,
    speedElapsed: 0,
    turnOrder: [],
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

const makeConnection = (game: GameType): ConnectionType => {
  const games = new Map<string, GameType>();
  games.set("game-1", game);

  return {
    meta: { games },
    io: { to: () => ({ emit: vi.fn() }) } as never,
    socket: {} as never,
  };
};

describe("handleTurn", () => {
  it("records a hit and reduces target life when a maneuver connects (regression: instance map must be pre-populated per target)", () => {
    // Force deterministic rolls: toHit = 0 (always lands) and no damage spread.
    mockedRandNum.mockReturnValue(0);

    const attacker = makeEnemy("attacker");
    const target = makePlayer("target");
    const game = makeGame(attacker, target);
    const connection = makeConnection(game);

    const turn: EnemyTurnType = {
      gameId: "game-1",
      sourceId: "attacker",
      maneuver: "bonk",
      targetIds: ["target"],
      team: "enemy",
    };

    handleTurn(connection, turn);

    const updatedGame = connection.meta.games.get("game-1")!;
    const lastMessage =
      updatedGame.battle!.messages[updatedGame.battle!.messages.length - 1];

    // The core regression: previously the instance map stayed empty for the
    // whole step, so no hit/miss message was ever logged and no damage applied.
    expect(lastMessage.steps).toBeDefined();
    expect(lastMessage.steps!.length).toBeGreaterThan(0);
    expect(lastMessage.steps![0]).toMatch(/^Hit target for \d+ damage/);

    const updatedTarget = updatedGame.characters!.target as PlayerType;
    expect(updatedTarget.stats.core.life).toBeLessThan(100);
  });

  it("logs a miss message when the target evades", () => {
    // toHit = 99 guarantees a miss against bonk's 85 accuracy with no dodge modifiers.
    mockedRandNum.mockReturnValue(99);

    const attacker = makeEnemy("attacker");
    const target = makePlayer("target");
    const game = makeGame(attacker, target);
    const connection = makeConnection(game);

    const turn: EnemyTurnType = {
      gameId: "game-1",
      sourceId: "attacker",
      maneuver: "bonk",
      targetIds: ["target"],
      team: "enemy",
    };

    handleTurn(connection, turn);

    const updatedGame = connection.meta.games.get("game-1")!;
    const lastMessage =
      updatedGame.battle!.messages[updatedGame.battle!.messages.length - 1];

    expect(lastMessage.steps).toEqual(["Missed target."]);

    const updatedTarget = updatedGame.characters!.target as PlayerType;
    expect(updatedTarget.stats.core.life).toBe(100);
  });
});
