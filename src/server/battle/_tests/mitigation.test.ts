import { describe, expect, it } from "vitest";
import {
  calcEvasion,
  calcMitigation,
  handleMitigation,
} from "../mitigation.ts";
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

describe("calcEvasion", () => {
  it("does nothing when the instance map is empty", () => {
    const ctx = makeCtx({ instance: new Map() });
    const result = calcEvasion(
      { type: "hit", accuracy: 0, damageType: "blunt", strength: 1 },
      ctx,
    );
    expect(result.instance.size).toBe(0);
  });

  it("marks a hit as evaded when toHit exceeds accuracy minus dodge", () => {
    const target = makePlayer("target");
    target.stats.discipline.dodge = 20;
    const ctx = makeCtx({
      characters: { target },
      toHit: 90,
      accuracy: 100,
      instance: new Map([
        ["target", { damage: 0, mitigation: 0, heal: 0, evaded: false }],
      ]),
    });

    const result = calcEvasion(
      { type: "hit", accuracy: 0, damageType: "blunt", strength: 1 },
      ctx,
    );

    // toHit(90) > accuracy(100) - dodge(20) = 80 -> evaded
    expect(result.instance.get("target")?.evaded).toBe(true);
  });

  it("uses negation for elemental/psychic damage instead of dodge", () => {
    const target = makePlayer("target");
    target.stats.discipline.dodge = 0;
    target.stats.discipline.negation = 50;
    const ctx = makeCtx({
      characters: { target },
      toHit: 10,
      accuracy: 100,
      instance: new Map([
        ["target", { damage: 0, mitigation: 0, heal: 0, evaded: false }],
      ]),
    });

    const result = calcEvasion(
      { type: "hit", accuracy: 0, damageType: "psychic", strength: 1 },
      ctx,
    );

    // toHit(10) > accuracy(100) - negation(50) = 50 -> not evaded
    expect(result.instance.get("target")?.evaded).toBe(false);
  });
});

describe("calcMitigation", () => {
  it("does nothing when the instance map is empty", () => {
    const ctx = makeCtx({ instance: new Map() });
    const result = calcMitigation(ctx, "blunt");
    expect(result.instance.size).toBe(0);
  });

  it("leaves mitigation at 0 when the target has no armor", () => {
    const target = makePlayer("target");
    const ctx = makeCtx({
      characters: { target },
      instance: new Map([
        ["target", { damage: 10, mitigation: 0, heal: 0, evaded: false }],
      ]),
    });

    const result = calcMitigation(ctx, "blunt");
    expect(result.instance.get("target")?.mitigation).toBe(0);
  });

  it("computes mitigation from armor block and defensive affinities", () => {
    const target = makePlayer("target", {
      equipped: {
        weapon: null,
        armor: "leather",
        blessings: [],
        enchantments: [],
      },
    });
    target.stats.discipline.defense = 10;
    target.stats.mastery.padding = 10;
    const ctx = makeCtx({
      characters: { target },
      instance: new Map([
        ["target", { damage: 10, mitigation: 0, heal: 0, evaded: false }],
      ]),
    });

    const result = calcMitigation(ctx, "blunt");
    // leather: block 4, defense affinity 1.8, plating affinity 0.6 (used for blunt->padding)
    // mitigation = 4 + 1.8*10 + 0.6*10 = 28
    expect(result.instance.get("target")?.mitigation).toBe(28);
  });

  it("accumulates onto existing mitigation instead of overwriting it", () => {
    const target = makePlayer("target", {
      equipped: {
        weapon: null,
        armor: "leather",
        blessings: [],
        enchantments: [],
      },
    });
    const ctx = makeCtx({
      characters: { target },
      instance: new Map([
        ["target", { damage: 10, mitigation: 5, heal: 0, evaded: false }],
      ]),
    });

    const result = calcMitigation(ctx, "blunt");
    // 5 (existing) + 4 (leather block, stats are 0) = 9
    expect(result.instance.get("target")?.mitigation).toBe(9);
  });
});

describe("handleMitigation", () => {
  it("delegates to calcMitigation using the step's damage type", () => {
    const target = makePlayer("target", {
      equipped: {
        weapon: null,
        armor: "leather",
        blessings: [],
        enchantments: [],
      },
    });
    const ctx = makeCtx({
      characters: { target },
      instance: new Map([
        ["target", { damage: 10, mitigation: 0, heal: 0, evaded: false }],
      ]),
    });

    const result = handleMitigation(ctx, {
      type: "hit",
      accuracy: 0,
      damageType: "blunt",
      strength: 1,
    });

    expect(result.instance.get("target")?.mitigation).toBe(4);
  });
});
