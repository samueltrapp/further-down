import { ActionCtx } from "../../types/events/actionCtx.ts";
import { armorMap } from "../../shared/definitions/armors/sets.ts";
import { limitToZero, trunc } from "../utils/battle.ts";
import { EffectName } from "../../types/equipables/effects.ts";
import { BurnSourceState } from "../../types/individual/characters.ts";

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

export const applyBurnSource = (
  ctx: ActionCtx,
  sourceId: string,
  targetId: string,
  name: EffectName,
  flatDamage: number,
  scalingDamage: number,
  stacks = 1,
): ActionCtx => {
  const target = ctx.characters[targetId];
  const existingBurns = target.burnSources[sourceId] ?? [];
  const burn = existingBurns.find((existing) => existing.name === name);

  if (burn) {
    burn.stacks += stacks;
  } else {
    existingBurns.push({
      name,
      stacks,
      flatDamage,
      scalingDamage,
      lastSpeedElapsed: ctx.speedElapsed,
    });
  }
  target.burnSources[sourceId] = existingBurns;
  return ctx;
};

export const removeBurnSource = (
  ctx: ActionCtx,
  sourceId: string,
  targetId: string,
  name: EffectName,
  stacks: number,
): ActionCtx => {
  const target = ctx.characters[targetId];
  const existingBurns = target.burnSources[sourceId];
  const burn = existingBurns.find((existing) => existing.name === name);
  if (!burn) return ctx;

  burn.stacks -= stacks;
  if (burn.stacks <= 0) {
    const remaining = existingBurns.filter((entry) => entry !== burn);
    if (remaining.length === 0) {
      delete target.burnSources[sourceId];
    } else {
      target.burnSources[sourceId] = remaining;
    }
  }
  return ctx;
};

export const processBurnDamage = (ctx: ActionCtx): ActionCtx => {
  const currentId = ctx.sourceId;
  const target = ctx.characters[currentId];
  if (!target || Object.keys(target.burnSources).length === 0) return ctx;

  const mitigation = calcElementalMitigation(ctx, currentId);

  Object.entries(target.burnSources).forEach(([ownerId, sources]) => {
    sources.forEach((source: BurnSourceState) => {
      const elapsed = ctx.speedElapsed - source.lastSpeedElapsed;
      if (elapsed <= 0) return;

      const ownerElemental =
        ctx.characters[ownerId]?.stats.mastery.elemental ?? 0;
      const damagePerSpeed =
        (source.flatDamage + ownerElemental * source.scalingDamage) *
        source.stacks;
      const rawDamage = trunc(damagePerSpeed * elapsed);
      const actualDamage = limitToZero(rawDamage - mitigation);

      target.stats.core.life = limitToZero(
        target.stats.core.life - actualDamage,
      );
      const ownerName = ctx.characters[ownerId]?.name ?? "unknown";
      ctx.messages.steps?.push(
        `${target.name} burns for ${actualDamage} (${rawDamage} - ${mitigation}) from ${source.name} (${ownerName}).`,
      );
      source.lastSpeedElapsed = ctx.speedElapsed;
    });
  });

  return ctx;
};
