import { describe, expect, it } from "vitest";
import {
  applyEffect,
  removeEffects,
} from "../../../../server/battle/effect.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";
import { PlayerType } from "../../../../types/individual/characters.ts";
import { StatsType } from "../../../../types/individual/stats.ts";
import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";

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

const makePlayer = (id: string): PlayerType => ({
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

describe("gossamer effect", () => {
  it("grants evasion bonus based on caster's plating to the target", () => {
    const caster = makePlayer("caster");
    caster.stats.mastery.plating = 40;
    const target = makePlayer("target");

    const ctx: ActionCtx = {
      characters: { caster, target },
      sourceId: "caster",
      targetIds: ["target"],
      maneuver: {} as ManeuverType,
      speed: 0,
      speedElapsed: 0,
      messages: { headline: "", steps: [] },
      toHit: 0,
      accuracy: 0,
      instance: new Map(),
      heal: 0,
      round: 0,
    };

    const result = applyEffect(ctx, "caster", ["target"], "gossamer");

    // evasion bonus = 10 + (40 * 0.25) = 10 + 10 = 20
    expect(result.characters.target.stats.discipline.dodge).toBe(20);
    expect(result.characters.target.effects["gossamer"]?.stacks[0].value).toBe(
      20,
    );
  });

  it("escalates the magnitude when applied multiple times, without resetting duration", () => {
    const caster = makePlayer("caster");
    caster.stats.mastery.plating = 20;
    const target = makePlayer("target");

    let ctx: ActionCtx = {
      characters: { caster, target },
      sourceId: "caster",
      targetIds: ["target"],
      maneuver: {} as ManeuverType,
      speed: 0,
      speedElapsed: 0,
      messages: { headline: "", steps: [] },
      toHit: 0,
      accuracy: 0,
      instance: new Map(),
      heal: 0,
      round: 0,
    };

    // First application: 10 + (20 * 0.25) = 15 evasion
    ctx = applyEffect(ctx, "caster", ["target"], "gossamer");
    expect(ctx.characters.target.stats.discipline.dodge).toBe(15);
    expect(ctx.characters.target.effects["gossamer"]?.stacks[0].value).toBe(15);
    expect(ctx.characters.target.effects["gossamer"]?.stacks.length).toBe(1);

    // Second application: another 15 evasion, escalated onto the same stack
    ctx = applyEffect(ctx, "caster", ["target"], "gossamer");
    expect(ctx.characters.target.stats.discipline.dodge).toBe(30);
    expect(ctx.characters.target.effects["gossamer"]?.stacks[0].value).toBe(30);
    expect(ctx.characters.target.effects["gossamer"]?.stacks.length).toBe(1);
  });

  it("scales with caster's plating stat correctly", () => {
    const caster = makePlayer("caster");
    caster.stats.mastery.plating = 100; // 100% -> 25 bonus
    const target = makePlayer("target");

    const ctx: ActionCtx = {
      characters: { caster, target },
      sourceId: "caster",
      targetIds: ["target"],
      maneuver: {} as ManeuverType,
      speed: 0,
      speedElapsed: 0,
      messages: { headline: "", steps: [] },
      toHit: 0,
      accuracy: 0,
      instance: new Map(),
      heal: 0,
      round: 0,
    };

    const result = applyEffect(ctx, "caster", ["target"], "gossamer");

    // evasion bonus = 10 + (100 * 0.25) = 10 + 25 = 35
    expect(result.characters.target.stats.discipline.dodge).toBe(35);
  });

  it("removes the evasion bonus at round end", () => {
    const caster = makePlayer("caster");
    caster.stats.mastery.plating = 40;
    const target = makePlayer("target");

    let ctx: ActionCtx = {
      characters: { caster, target },
      sourceId: "caster",
      targetIds: ["target"],
      maneuver: {} as ManeuverType,
      speed: 0,
      speedElapsed: 0,
      messages: { headline: "", steps: [] },
      toHit: 0,
      accuracy: 0,
      instance: new Map(),
      heal: 0,
      round: 0,
    };

    ctx = applyEffect(ctx, "caster", ["target"], "gossamer");
    expect(ctx.characters.target.stats.discipline.dodge).toBe(20);

    const afterRoundEnd = removeEffects(ctx, "rounds");

    expect(afterRoundEnd.characters.target.stats.discipline.dodge).toBe(0);
    expect(afterRoundEnd.characters.target.effects["gossamer"]).toBeUndefined();
  });

  it("removes the full escalated value in one shot when the stack expires", () => {
    const caster = makePlayer("caster");
    caster.stats.mastery.plating = 20; // 15 evasion per application
    const target = makePlayer("target");

    let ctx: ActionCtx = {
      characters: { caster, target },
      sourceId: "caster",
      targetIds: ["target"],
      maneuver: {} as ManeuverType,
      speed: 0,
      speedElapsed: 0,
      messages: { headline: "", steps: [] },
      toHit: 0,
      accuracy: 0,
      instance: new Map(),
      heal: 0,
      round: 0,
    };

    // Apply gossamer twice (escalates onto one stack)
    ctx = applyEffect(ctx, "caster", ["target"], "gossamer");
    ctx = applyEffect(ctx, "caster", ["target"], "gossamer");

    expect(ctx.characters.target.effects["gossamer"]?.stacks[0].value).toBe(30);
    expect(ctx.characters.target.stats.discipline.dodge).toBe(30);

    // Remove effects at round end (the single escalated stack expires)
    const afterRoundEnd = removeEffects(ctx, "rounds");

    expect(afterRoundEnd.characters.target.effects["gossamer"]).toBeUndefined();
    expect(afterRoundEnd.characters.target.stats.discipline.dodge).toBe(0);
  });

  it("handles zero plating gracefully", () => {
    const caster = makePlayer("caster");
    caster.stats.mastery.plating = 0;
    const target = makePlayer("target");

    const ctx: ActionCtx = {
      characters: { caster, target },
      sourceId: "caster",
      targetIds: ["target"],
      maneuver: {} as ManeuverType,
      speed: 0,
      speedElapsed: 0,
      messages: { headline: "", steps: [] },
      toHit: 0,
      accuracy: 0,
      instance: new Map(),
      heal: 0,
      round: 0,
    };

    const result = applyEffect(ctx, "caster", ["target"], "gossamer");

    // evasion bonus = 10 + (0 * 0.25) = 10
    expect(result.characters.target.stats.discipline.dodge).toBe(10);
  });

  it("allows multiple targets to receive the effect in one call", () => {
    const caster = makePlayer("caster");
    caster.stats.mastery.plating = 40;
    const ally1 = makePlayer("ally1");
    const ally2 = makePlayer("ally2");

    const ctx: ActionCtx = {
      characters: { caster, ally1, ally2 },
      sourceId: "caster",
      targetIds: ["ally1", "ally2"],
      maneuver: {} as ManeuverType,
      speed: 0,
      speedElapsed: 0,
      messages: { headline: "", steps: [] },
      toHit: 0,
      accuracy: 0,
      instance: new Map(),
      heal: 0,
      round: 0,
    };

    const result = applyEffect(ctx, "caster", ["ally1", "ally2"], "gossamer");

    expect(result.characters.ally1.stats.discipline.dodge).toBe(20);
    expect(result.characters.ally2.stats.discipline.dodge).toBe(20);
  });

  it("uses stored applied value for removal, not recalculated value (handles stat changes)", () => {
    const caster = makePlayer("caster");
    caster.stats.mastery.plating = 40; // Initial plating
    const target = makePlayer("target");

    let ctx: ActionCtx = {
      characters: { caster, target },
      sourceId: "caster",
      targetIds: ["target"],
      maneuver: {} as ManeuverType,
      speed: 0,
      speedElapsed: 0,
      messages: { headline: "", steps: [] },
      toHit: 0,
      accuracy: 0,
      instance: new Map(),
      heal: 0,
      round: 0,
    };

    // Apply gossamer: evasion = 10 + (40 * 0.25) = 20
    ctx = applyEffect(ctx, "caster", ["target"], "gossamer");
    expect(ctx.characters.target.stats.discipline.dodge).toBe(20);

    // Simulate caster losing plating (stat change)
    ctx.characters.caster.stats.mastery.plating = 0;

    // Remove effect - should still remove 20 evasion (stored value), not 10 (recalculated)
    const afterRemove = removeEffects(ctx, "rounds");
    expect(afterRemove.characters.target.stats.discipline.dodge).toBe(0);
  });
});
