import { describe, expect, it } from "vitest";
import { handleSideEffects } from "../../../../server/battle/sideEffects.ts";
import { removeEffects } from "../../../../server/battle/effect.ts";
import { processBurnDamage } from "../../../../server/battle/burn.ts";
import { makeCtx, makeEnemy, makePlayer } from "../../../_tests/testUtils.ts";

describe("eternal flame blessing", () => {
  it("applies the eternal flame effect and burn source to every enemy at the start of the round", () => {
    const owner = makePlayer("owner", [], ["eternal flame"]);
    const enemyOne = makeEnemy("enemyOne");
    const enemyTwo = makeEnemy("enemyTwo");

    const ctx = makeCtx({
      characters: { owner, enemyOne, enemyTwo },
      sourceId: "owner",
    });

    const result = handleSideEffects(ctx, "round-start");

    expect(
      result.characters.enemyOne.effects["eternal flame"]?.stacks[0].value,
    ).toBe(1);
    expect(
      result.characters.enemyTwo.effects["eternal flame"]?.stacks[0].value,
    ).toBe(1);

    /* Ally/owner should not be affected — selection is "all-enemies" only */
    expect(result.characters.owner.effects["eternal flame"]).toBeUndefined();
  });

  it("deals burn damage to an afflicted enemy over time", () => {
    const owner = makePlayer("owner", [], ["eternal flame"]);
    owner.stats.mastery.elemental = 10;
    const enemy = makeEnemy("enemy");

    let ctx = makeCtx({ characters: { owner, enemy }, sourceId: "owner" });
    ctx = handleSideEffects(ctx, "round-start");

    /* Simulate speed passing before the burn ticks */
    ctx = { ...ctx, sourceId: "enemy", speedElapsed: ctx.speedElapsed + 10 };
    ctx = processBurnDamage(ctx);

    expect(ctx.characters.enemy.stats.core.life).toBeLessThan(100);
  });

  it("removes the existing eternal flame stack at the end of the round, before it is re-applied at the start of the next round", () => {
    const owner = makePlayer("owner", [], ["eternal flame"]);
    const enemy = makeEnemy("enemy");

    let ctx = makeCtx({
      characters: { owner, enemy },
      sourceId: "owner",
      round: 0,
    });

    /* Round 1 start */
    ctx = handleSideEffects(ctx, "round-start");
    expect(ctx.characters.enemy.effects["eternal flame"]?.stacks[0].value).toBe(
      1,
    );

    /* Round 1 end: the stack applied at round-start should be removed */
    ctx = handleSideEffects(ctx, "round-end");
    ctx = removeEffects(ctx, "rounds");

    expect(ctx.characters.enemy.effects["eternal flame"]).toBeUndefined();

    /* Round 2 start: a fresh stack is applied */
    ctx = { ...ctx, round: 1 };
    ctx = handleSideEffects(ctx, "round-start");

    expect(ctx.characters.enemy.effects["eternal flame"]?.stacks[0].value).toBe(
      1,
    );
  });
});
