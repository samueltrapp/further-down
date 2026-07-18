import { describe, expect, it } from "vitest";
import { handleSideEffects } from "../../../../server/battle/sideEffects.ts";
import { removeEffects } from "../../../../server/battle/effect.ts";
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

const makePlayer = (
  id: string,
  enchantments: PlayerType["equipped"]["enchantments"] = [],
): PlayerType => ({
  id,
  name: id,
  userId: id,
  team: "player",
  equipped: { weapon: null, armor: null, blessings: [], enchantments },
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

describe("sharpen the blade enchantment", () => {
  it("grants a favor stack and +1 bladed mastery when the wielder lands a hit", () => {
    const attacker = makePlayer("attacker", ["sharpen the blade"]);
    const target = makePlayer("target");

    const ctx: ActionCtx = {
      characters: { attacker, target },
      sourceId: "attacker",
      targetIds: ["target"],
      maneuver: {} as ManeuverType,
      speed: 0,
      speedElapsed: 0,
      messages: { headline: "", steps: [] },
      toHit: 0,
      accuracy: 0,
      instance: new Map([
        ["target", { damage: 10, mitigation: 0, heal: 0, evaded: false }],
      ]),
      heal: 0,
      round: 0,
    };

    const result = handleSideEffects(ctx, "attack");

    expect(result.characters.attacker.effects["sharpen the blade"]?.value).toBe(
      1,
    );
    expect(result.characters.attacker.stats.mastery.bladed).toBe(1);
  });

  it("does not grant a stack when every hit was evaded", () => {
    const attacker = makePlayer("attacker", ["sharpen the blade"]);
    const target = makePlayer("target");

    const ctx: ActionCtx = {
      characters: { attacker, target },
      sourceId: "attacker",
      targetIds: ["target"],
      maneuver: {} as ManeuverType,
      speed: 0,
      speedElapsed: 0,
      messages: { headline: "", steps: [] },
      toHit: 0,
      accuracy: 0,
      instance: new Map([
        ["target", { damage: 0, mitigation: 0, heal: 0, evaded: true }],
      ]),
      heal: 0,
      round: 0,
    };

    const result = handleSideEffects(ctx, "attack");

    expect(result.characters.attacker.stats.mastery.bladed).toBe(0);
  });

  it("resets the effect and bladed mastery bonus at the end of the round", () => {
    const attacker = makePlayer("attacker", ["sharpen the blade"]);
    const target = makePlayer("target");

    const ctx: ActionCtx = {
      characters: { attacker, target },
      sourceId: "attacker",
      targetIds: ["target"],
      maneuver: {} as ManeuverType,
      speed: 0,
      speedElapsed: 0,
      messages: { headline: "", steps: [] },
      toHit: 0,
      accuracy: 0,
      instance: new Map([
        ["target", { damage: 10, mitigation: 0, heal: 0, evaded: false }],
      ]),
      heal: 0,
      round: 0,
    };

    const afterHit = handleSideEffects(ctx, "attack");

    expect(
      afterHit.characters.attacker.effects["sharpen the blade"]?.value,
    ).toBe(1);
    expect(afterHit.characters.attacker.stats.mastery.bladed).toBe(1);

    const afterRoundEnd = removeEffects(afterHit, "rounds");

    expect(
      afterRoundEnd.characters.attacker.effects["sharpen the blade"],
    ).toBeUndefined();
    expect(afterRoundEnd.characters.attacker.stats.mastery.bladed).toBe(0);
  });
});
