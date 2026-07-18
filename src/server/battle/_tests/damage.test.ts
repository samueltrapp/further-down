import { describe, expect, it } from "vitest";
import {
  applyDamage,
  calcAccuracy,
  calcDamage,
  handleAccuracy,
  handleAttack,
  handleDamage,
} from "../damage.ts";
import { ActionCtx } from "../../../types/events/actionCtx.ts";
import { PlayerType } from "../../../types/individual/characters.ts";
import { StatsType } from "../../../types/individual/stats.ts";
import { ManeuverType } from "../../../types/equipables/maneuvers.ts";

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

const makePlayer = (
  id: string,
  overrides: Partial<PlayerType> = {},
): PlayerType => ({
  id,
  name: id,
  userId: id,
  team: "player",
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

const makeCtx = (overrides: Partial<ActionCtx> = {}): ActionCtx => ({
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
  ...overrides,
});

describe("calcDamage", () => {
  it("returns 0 when the source character does not exist", () => {
    const ctx = makeCtx({ characters: {}, sourceId: "ghost" });
    expect(calcDamage(ctx, "blunt", 1)).toBe(0);
  });

  it("returns 0 when the source has no equipped weapon", () => {
    const attacker = makePlayer("attacker");
    const ctx = makeCtx({ characters: { attacker } });
    expect(calcDamage(ctx, "blunt", 1)).toBe(0);
  });

  it("computes damage from weapon power and stat affinities", () => {
    const attacker = makePlayer("attacker", {
      equipped: {
        weapon: "cutlass",
        armor: null,
        blessings: [],
        enchantments: [],
      },
    });
    attacker.stats.discipline.martial = 5;
    attacker.stats.mastery.bladed = 5;
    const ctx = makeCtx({ characters: { attacker } });

    const damage = calcDamage(ctx, "bladed", 1);
    // cutlass: power 7, spread 2 (bounded), martial affinity 1.2, bladed affinity 1.8
    // damage = (7 +/- 2) + (1.2*5 + 1.8*5) = base + 15
    expect(damage).toBeGreaterThanOrEqual(5 + 15);
    expect(damage).toBeLessThanOrEqual(9 + 15);
  });
});

describe("calcAccuracy", () => {
  it("returns 0 when the source does not exist", () => {
    const ctx = makeCtx({ characters: {}, sourceId: "ghost" });
    expect(calcAccuracy(ctx, "blunt", 50)).toBe(0);
  });

  it("adds physical precision for bladed/blunt damage", () => {
    const attacker = makePlayer("attacker");
    attacker.stats.discipline.precision = 10;
    const ctx = makeCtx({ characters: { attacker } });
    expect(calcAccuracy(ctx, "blunt", 50)).toBe(60);
  });

  it("adds mystic control for elemental/psychic damage", () => {
    const attacker = makePlayer("attacker");
    attacker.stats.discipline.control = 15;
    const ctx = makeCtx({ characters: { attacker } });
    expect(calcAccuracy(ctx, "psychic", 40)).toBe(55);
  });
});

describe("handleDamage / handleAccuracy / handleAttack", () => {
  it("only applies damage to targets that already have an instance entry", () => {
    const attacker = makePlayer("attacker", {
      equipped: {
        weapon: "cutlass",
        armor: null,
        blessings: [],
        enchantments: [],
      },
    });
    const ctx = makeCtx({
      characters: { attacker },
      targetIds: ["target", "untracked"],
      instance: new Map([
        ["target", { damage: 0, mitigation: 0, heal: 0, evaded: false }],
      ]),
    });

    const result = handleDamage(ctx, {
      type: "hit",
      accuracy: 0,
      damageType: "bladed",
      strength: 1,
    });

    expect(result.instance.get("target")?.damage).toBeGreaterThan(0);
    expect(result.instance.get("untracked")).toBeUndefined();
  });

  it("does not mutate instance entries when the map is empty (regression guard)", () => {
    const attacker = makePlayer("attacker", {
      equipped: {
        weapon: "cutlass",
        armor: null,
        blessings: [],
        enchantments: [],
      },
    });
    const ctx = makeCtx({
      characters: { attacker },
      targetIds: ["target"],
      instance: new Map(),
    });

    const result = handleDamage(ctx, {
      type: "hit",
      accuracy: 0,
      damageType: "bladed",
      strength: 1,
    });

    expect(result.instance.size).toBe(0);
  });

  it("sets ctx.accuracy from the step and source stats", () => {
    const attacker = makePlayer("attacker");
    attacker.stats.discipline.precision = 5;
    const ctx = makeCtx({ characters: { attacker } });

    const result = handleAccuracy(ctx, {
      type: "hit",
      accuracy: 20,
      damageType: "blunt",
      strength: 1,
    });

    expect(result.accuracy).toBe(25);
  });

  it("handleAttack applies damage, accuracy, and rolls toHit", () => {
    const attacker = makePlayer("attacker", {
      equipped: {
        weapon: "cutlass",
        armor: null,
        blessings: [],
        enchantments: [],
      },
    });
    const ctx = makeCtx({
      characters: { attacker },
      targetIds: ["target"],
      instance: new Map([
        ["target", { damage: 0, mitigation: 0, heal: 0, evaded: false }],
      ]),
    });

    const result = handleAttack(ctx, {
      type: "hit",
      accuracy: 50,
      damageType: "bladed",
      strength: 1,
    });

    expect(result.instance.get("target")?.damage).toBeGreaterThan(0);
    expect(result.accuracy).toBe(50);
    expect(result.toHit).toBeGreaterThanOrEqual(0);
    expect(result.toHit).toBeLessThan(100);
  });
});

describe("applyDamage", () => {
  it("logs a miss message and does not reduce life when evaded", () => {
    const target = makePlayer("target");
    const ctx = makeCtx({
      characters: { target },
      instance: new Map([
        ["target", { damage: 10, mitigation: 0, heal: 0, evaded: true }],
      ]),
    });

    const result = applyDamage(ctx);

    expect(result.messages.steps).toEqual(["Missed target."]);
    expect(result.characters.target.stats.core.life).toBe(100);
  });

  it("logs a hit message and reduces life by damage minus mitigation", () => {
    const target = makePlayer("target");
    const ctx = makeCtx({
      characters: { target },
      instance: new Map([
        ["target", { damage: 10, mitigation: 4, heal: 0, evaded: false }],
      ]),
    });

    const result = applyDamage(ctx);

    expect(result.messages.steps).toEqual([
      "Hit target for 6 damage (10 - 4).",
    ]);
    expect(result.characters.target.stats.core.life).toBe(94);
  });

  it("does not push any messages when instance is empty (regression guard)", () => {
    const target = makePlayer("target");
    const ctx = makeCtx({
      characters: { target },
      instance: new Map(),
    });

    const result = applyDamage(ctx);

    expect(result.messages.steps).toEqual([]);
  });
});
