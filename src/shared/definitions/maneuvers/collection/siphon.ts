import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";
import { limitToZero, trunc } from "../../../../server/utils/battle.ts";

const LEECH_RATIO = 0.5;

/**
 * Heals the source based on the actual (post-mitigation) damage dealt by the
 * maneuver's previous hit step. Demonstrates how a heal step can depend on a
 * prior step's outcome via ctx.previousResults, rather than the standard
 * weapon-based heal calc.
 */
const leechFromLastStep = (ctx: ActionCtx): ActionCtx => {
  const lastResult = ctx.previousResults.at(-1);
  if (!lastResult) {
    return ctx;
  }

  let totalDamageDealt = 0;
  lastResult.instance.forEach((instanceDtl) => {
    if (!instanceDtl.evaded) {
      totalDamageDealt += limitToZero(
        trunc(instanceDtl.damage - instanceDtl.mitigation),
      );
    }
  });

  const leechedHeal = trunc(totalDamageDealt * LEECH_RATIO);
  const sourceInstance = ctx.instance.get(ctx.sourceId);
  if (sourceInstance) {
    sourceInstance.heal += leechedHeal;
  }
  ctx.heal += leechedHeal;

  return ctx;
};

const siphon: ManeuverType = {
  name: "siphon",
  team: "player",
  description: "Strike an enemy and steal some of their life",
  speedCost: 5,
  perspective: "other",
  targetMethod: "select",
  maxTargets: 1,
  steps: [
    {
      type: "hit",
      accuracy: 85,
      damageType: "bladed",
      strength: 0.85,
    },
    {
      type: "heal",
      healType: "bladed",
      strength: 0,
      targetOverride: "self",
      healFn: leechFromLastStep,
    },
  ],
  tags: ["attack", "heal", "leech", "single", "pure"],
};

export default siphon;
