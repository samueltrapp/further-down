import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";
import { trunc } from "../../../../server/utils/battle.ts";

const splitHealEvenly = (ctx: ActionCtx): ActionCtx => {
  const { targetIds, instance } = ctx;

  if (targetIds.length === 0) {
    return ctx;
  }

  const totalHeal = instance.get(targetIds[0])?.heal ?? 0;
  const perTargetHeal = trunc(totalHeal / targetIds.length);

  targetIds.forEach((targetId) => {
    const existingInstance = instance.get(targetId);
    if (existingInstance) {
      existingInstance.heal = perTargetHeal;
    }
  });

  ctx.heal = perTargetHeal * targetIds.length;

  return ctx;
};

export const soothe: ManeuverType = {
  name: "soothe",
  team: "player",
  description: "Heals equally among any number of allies",
  speedCost: 7,
  perspective: "own",
  targetMethod: "select",
  maxTargets: 4,
  steps: [
    {
      type: "heal",
      healType: "elemental",
      strength: 1,
      healFn: splitHealEvenly,
    },
  ],
  tags: ["heal", "elemental"],
};
