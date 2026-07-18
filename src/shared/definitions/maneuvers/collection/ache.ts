import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";
import { trunc } from "../../../../server/utils/battle.ts";

const SCALING_PSY_MOD = 0.3;

const addAnguish = (ctx: ActionCtx) => {
  const { characters, instance, sourceId } = { ...ctx };

  instance.forEach((instanceDtl, targetId) => {
    const anguishStacks = characters[targetId].effects.anguish?.value ?? 0;
    const damagePerStack =
      characters[sourceId].stats.mastery.psychic * SCALING_PSY_MOD;
    const anguishDamage = anguishStacks * damagePerStack;
    instanceDtl.damage = trunc((instanceDtl.damage || 0) + anguishDamage);
  });

  return ctx;
};

const ache: ManeuverType = {
  name: "ache",
  team: "player",
  description: "Ache description",
  speedCost: 5,
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
      strength: 0.9,
      hitFn: (ctx) => addAnguish(ctx),
    },
  ],
  tags: ["attack", "single", "pure", "psychic", "burden"],
};

export default ache;
