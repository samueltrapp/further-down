import { ActionCtx } from "../../types/events/actionCtx.ts";
import { armorMap } from "../../shared/definitions/armors/sets.ts";
import { limitToZero, trunc } from "../utils/battle.ts";
import { EffectName } from "../../types/equipables/effects.ts";
import { effectMap } from "../../shared/definitions/effects/sets.ts";

const calcBladedMitigation = (ctx: ActionCtx, targetId: string): number => {
  const character = ctx.characters[targetId];
  if (!character?.stats || !character.equipped.armor) return 0;
  const armor = armorMap.get(character.equipped.armor);
  if (!armor) return 0;
  return trunc(
    armor.block +
      armor.affinities.defense * character.stats.discipline.defense +
      armor.affinities.plating * character.stats.mastery.plating,
  );
};

export const processBleedDamage = (ctx: ActionCtx): ActionCtx => {
  const targetId = ctx.sourceId;
  const target = ctx.characters[targetId];
  if (!target) return ctx;

  const mitigation = calcBladedMitigation(ctx, targetId);

  Object.entries(target.effects).forEach(([name, state]) => {
    const effectName = name as EffectName;
    const effectDef = effectMap.get(effectName);
    if (!effectDef || effectDef.special !== "bleed" || !state) return;

    const flatDamage = effectDef.flatDamage ?? 0;
    const scalingDamage = effectDef.scalingDamage ?? 0;

    state.stacks.forEach((stack) => {
      const ownerPadding =
        ctx.characters[stack.owner]?.stats.mastery.padding ?? 0;
      const damagePerTick =
        (flatDamage + ownerPadding * scalingDamage) * stack.value;
      const actualDamage = limitToZero(trunc(damagePerTick) - mitigation);

      target.stats.core.life = limitToZero(
        target.stats.core.life - actualDamage,
      );
      const ownerName = ctx.characters[stack.owner]?.name ?? "unknown";
      ctx.messages.steps?.push(
        `${target.name} bleeds for ${actualDamage} (${trunc(damagePerTick)} - ${mitigation}) from ${effectName} (${ownerName}).`,
      );
    });
  });

  return ctx;
};
