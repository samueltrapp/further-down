import { BlessingType } from "../../../../types/equipables/blessings.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";

const FLAT_DAMAGE = 0.05;
const SCALING_DAMAGE = 0.03;

const applyEternalFlame = (
  ctx: ActionCtx,
  targetIds: string[],
): ActionCtx => {
  const ownerId = ctx.sourceId;
  targetIds.forEach((targetId) => {
    const target = ctx.characters[targetId];
    if (!target) return;
    target.burnSources[ownerId] = {
      flatDamage: FLAT_DAMAGE,
      scalingDamage: SCALING_DAMAGE,
      lastSpeedElapsed: ctx.speedElapsed,
    };
  });
  return ctx;
};

const eternalFlame: BlessingType = {
  name: "eternal flame",
  description: "At the start of your turn, sears every enemy with a small, lingering burn.",
  trigger: "turn-start",
  onTrigger: applyEternalFlame,
};

export default eternalFlame;

