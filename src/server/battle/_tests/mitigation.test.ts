import { describe, expect, it } from "vitest";
import {
  calcEvasion,
  calcMitigation,
  handleMitigation,
} from "../mitigation.ts";
import { makePlayer, makeCtx } from "../../../shared/_tests/testUtils.ts";

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
