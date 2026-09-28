import { ActionCtx } from "../../types/events/actionCtx.ts";
import { armorMap } from "../../shared/definitions/armors/sets.ts";
import { limitToZero, trunc } from "../utils/battle.ts";
import { EffectName } from "../../types/equipables/effects.ts";
import { effectMap } from "../../shared/definitions/effects/sets.ts";

const calcElementalMitigation = (ctx: ActionCtx, targetId: string): number => {
  const character = ctx.characters[targetId];
  if (!character?.stats || !character.equipped.armor) return 0;

  const armor = armorMap.get(character.equipped.armor);
  if (!armor) return 0;
  return trunc(
    armor.block +
      armor.affinities.resistance * character.stats.discipline.resistance +
      armor.affinities.dampening * character.stats.mastery.dampening,
  );
};

export const processBurnDamage = (ctx: ActionCtx): ActionCtx => {
  const currentId = ctx.sourceId;
  const target = ctx.characters[currentId];
  if (!target) return ctx;

  const mitigation = calcElementalMitigation(ctx, currentId);

  Object.entries(target.effects).forEach(([name, state]) => {
    const effectName = name as EffectName;
    const effectDef = effectMap.get(effectName);
    if (!effectDef || effectDef.special !== "burn" || !state) return;

    const flatDamage = effectDef.flatDamage ?? 0;
    const scalingDamage = effectDef.scalingDamage ?? 0;

    state.stacks.forEach((stack) => {
      const elapsed = ctx.speedElapsed - (stack.lastSpeedElapsed ?? 0);
      if (elapsed <= 0) return;

      const ownerElemental =
        ctx.characters[stack.owner]?.stats.mastery.elemental ?? 0;
      const damagePerSpeed =
        (flatDamage + ownerElemental * scalingDamage) * stack.value;
      const rawDamage = trunc(damagePerSpeed * elapsed);
      const actualDamage = limitToZero(rawDamage - mitigation);

      target.stats.core.life = limitToZero(
        target.stats.core.life - actualDamage,
      );
      const ownerName = ctx.characters[stack.owner]?.name ?? "unknown";
      ctx.messages.steps?.push(
        `${target.name} burns for ${actualDamage} (${rawDamage} - ${mitigation}) from ${effectName} (${ownerName}).`,
      );
      stack.lastSpeedElapsed = ctx.speedElapsed;
    });
  });

  return ctx;
};
