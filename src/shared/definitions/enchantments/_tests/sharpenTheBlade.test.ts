import { describe, expect, it } from "vitest";
import { handleSideEffects } from "../../../../server/battle/sideEffects.ts";
import { removeEffects } from "../../../../server/battle/effect.ts";
import { makeCtx, makePlayer } from "../../../_tests/testUtils.ts";

describe("sharpen the blade enchantment", () => {
  it("grants a favor stack and +1 bladed mastery when the wielder lands a hit", () => {
    const attacker = makePlayer("attacker", ["sharpen the blade"]);
    const target = makePlayer("target");

    const ctx = makeCtx({
      characters: { attacker, target },
      sourceId: "attacker",
      targetIds: ["target"],
      instance: new Map([
        ["target", { damage: 10, mitigation: 0, heal: 0, evaded: false }],
      ]),
    });

    const result = handleSideEffects(ctx, "attack");

    expect(
      result.characters.attacker.effects["sharpen the blade"]?.stacks[0].value,
    ).toBe(1);
    expect(result.characters.attacker.stats.mastery.bladed).toBe(1);
  });

  it("does not grant a stack when every hit was evaded", () => {
    const attacker = makePlayer("attacker", ["sharpen the blade"]);
    const target = makePlayer("target");

    const ctx = makeCtx({
      characters: { attacker, target },
      sourceId: "attacker",
      targetIds: ["target"],
      instance: new Map([
        ["target", { damage: 0, mitigation: 0, heal: 0, evaded: true }],
      ]),
    });

    const result = handleSideEffects(ctx, "attack");

    expect(result.characters.attacker.stats.mastery.bladed).toBe(0);
  });

  it("resets the effect and bladed mastery bonus at the end of the round", () => {
    const attacker = makePlayer("attacker", ["sharpen the blade"]);
    const target = makePlayer("target");

    const ctx = makeCtx({
      characters: { attacker, target },
      sourceId: "attacker",
      targetIds: ["target"],
      instance: new Map([
        ["target", { damage: 10, mitigation: 0, heal: 0, evaded: false }],
      ]),
    });

    const afterHit = handleSideEffects(ctx, "attack");

    expect(
      afterHit.characters.attacker.effects["sharpen the blade"]?.stacks[0]
        .value,
    ).toBe(1);
    expect(afterHit.characters.attacker.stats.mastery.bladed).toBe(1);

    const afterRoundEnd = removeEffects(afterHit, "rounds");

    expect(
      afterRoundEnd.characters.attacker.effects["sharpen the blade"],
    ).toBeUndefined();
    expect(afterRoundEnd.characters.attacker.stats.mastery.bladed).toBe(0);
  });
});
