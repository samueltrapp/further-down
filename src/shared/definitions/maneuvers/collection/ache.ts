import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";
import { trunc } from "../../../../server/utils/battle.ts";

const addAnguish = (ctx: ActionCtx) => {
  const { characters, instance, sourceId } = { ...ctx };

  const newInstance = new Map();
  instance.forEach((instanceDtl, targetId) => {
    const anguishStacks = characters[targetId].effects.anguish || 0;
    const damagePerStack = characters[sourceId].stats.mastery.psychic * 0.3;
    const anguishDamage = anguishStacks * damagePerStack;
    newInstance.set(targetId, {
      ...instanceDtl,
      damage: trunc((instanceDtl.damage || 0) + anguishDamage),
    });
  });

  ctx.instance = newInstance;
  return ctx;
};

const ache: ManeuverType = {
  name: "ache",
  team: "player",
  description: "Ache description",
  speedCost: 7,
  perspective: "other",
  targetMethod: "select",
  maxTargets: 1,
  steps: [
    {
      type: "effect",
      effect: "anguish",
      stacks: 1,
    },
    {
      type: "hit",
      accuracy: 85,
      damageType: "psychic",
      strength: 1.1,
      hitFn: (ctx) => addAnguish(ctx),
    },
  ],
  tags: ["attack", "single", "pure", "psychic", "burden"],
};

export default ache;
