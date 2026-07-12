import { describe, expect, it } from "vitest";
import { handleSideEffects } from "../../../../server/battle/sideEffects.ts";
import { removeEffects } from "../../../../server/battle/effect.ts";
import { processBurnDamage } from "../../../../server/battle/burn.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";
import {
  EnemyType,
  PlayerType,
} from "../../../../types/individual/characters.ts";
import { StatsType } from "../../../../types/individual/stats.ts";
import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";

const blankStats = (): StatsType => ({
  core: {
    vitality: 20,
    protection: 0,
    life: 100,
    maxLife: 100,
    initiative: 20,
    finesse: 0,
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

const makePlayer = (
  id: string,
  blessings: PlayerType["equipped"]["blessings"] = [],
): PlayerType => ({
  id,
  name: id,
  userId: id,
  team: "player",
  equipped: { weapon: null, armor: null, blessings, enchantments: [] },
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
});

const makeEnemy = (id: string): EnemyType => ({
  id,
  name: id,
  team: "enemy",
  equipped: { weapon: null, armor: null, blessings: [], enchantments: [] },
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
});

const makeCtx = (
  characters: ActionCtx["characters"],
  sourceId: string,
  round = 0,
): ActionCtx => ({
  characters,
  sourceId,
  targetIds: [],
  maneuver: {} as ManeuverType,
  speed: 0,
  speedElapsed: 0,
  messages: { headline: "", steps: [] },
  toHit: 0,
  accuracy: 0,
  instance: new Map(),
  heal: 0,
  round,
});

describe("eternal flame blessing", () => {
  it("applies the eternal flame effect and burn source to every enemy at the start of the round", () => {
    const owner = makePlayer("owner", ["eternal flame"]);
    const enemyOne = makeEnemy("enemyOne");
    const enemyTwo = makeEnemy("enemyTwo");

    const ctx = makeCtx({ owner, enemyOne, enemyTwo }, "owner");

    const result = handleSideEffects(ctx, "round-start");

    expect(result.characters.enemyOne.effects["eternal flame"]?.value).toBe(1);
    expect(result.characters.enemyTwo.effects["eternal flame"]?.value).toBe(1);
    expect(result.characters.enemyOne.burnSources["owner"]).toBeDefined();
    expect(result.characters.enemyTwo.burnSources["owner"]).toBeDefined();

    /* Ally/owner should not be affected — selection is "all-enemies" only */
    expect(result.characters.owner.effects["eternal flame"]).toBeUndefined();
  });

  it("deals burn damage to an afflicted enemy over time", () => {
    const owner = makePlayer("owner", ["eternal flame"]);
    owner.stats.mastery.elemental = 10;
    const enemy = makeEnemy("enemy");

    let ctx = makeCtx({ owner, enemy }, "owner");
    ctx = handleSideEffects(ctx, "round-start");

    /* Simulate speed passing before the burn ticks */
    ctx = { ...ctx, sourceId: "enemy", speedElapsed: ctx.speedElapsed + 10 };
    ctx = processBurnDamage(ctx);

    expect(ctx.characters.enemy.stats.core.life).toBeLessThan(100);
  });

  it("removes the existing eternal flame stack at the end of the round, before it is re-applied at the start of the next round", () => {
    const owner = makePlayer("owner", ["eternal flame"]);
    const enemy = makeEnemy("enemy");

    let ctx = makeCtx({ owner, enemy }, "owner", 0);

    /* Round 1 start */
    ctx = handleSideEffects(ctx, "round-start");
    expect(ctx.characters.enemy.effects["eternal flame"]?.value).toBe(1);

    /* Round 1 end: the stack applied at round-start should be removed */
    ctx = handleSideEffects(ctx, "round-end");
    ctx = removeEffects(ctx, "rounds");

    expect(ctx.characters.enemy.effects["eternal flame"]).toBeUndefined();
    expect(ctx.characters.enemy.burnSources["owner"]).toBeUndefined();

    /* Round 2 start: a fresh stack is applied */
    ctx = { ...ctx, round: 1 };
    ctx = handleSideEffects(ctx, "round-start");

    expect(ctx.characters.enemy.effects["eternal flame"]?.value).toBe(1);
    expect(ctx.characters.enemy.burnSources["owner"]).toBeDefined();
  });
});
