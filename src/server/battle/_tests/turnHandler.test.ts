import { describe, expect, it, vi } from "vitest";
import { handleTurn } from "../turnHandler.ts";
import { PlayerType } from "../../../types/individual/characters.ts";
import { EnemyTurnType } from "../../../types/events/turn.ts";
import { randNum } from "../../../shared/utils.ts";
import {
  makeEnemy,
  makePlayer,
  makeGame,
  makeConnection,
} from "../../../shared/_tests/testUtils.ts";

vi.mock("../../../shared/utils.ts", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../../shared/utils.ts")>();
  return {
    ...actual,
    randNum: vi.fn(actual.randNum),
  };
});

const mockedRandNum = vi.mocked(randNum);

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
