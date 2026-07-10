import { ActionCtx } from "../../types/events/actionCtx.ts";
import { armorMap } from "../../shared/definitions/armors/sets.ts";
import { limitToZero, trunc } from "../utils/battle.ts";
import { EffectName } from "../../types/equipables/effects.ts";
import { BleedSourceState } from "../../types/individual/characters.ts";

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

export const applyBleedSource = (
  ctx: ActionCtx,
  sourceId: string,
  targetId: string,
  name: EffectName,
  flatDamage: number,
  scalingDamage: number,
  stacks = 1,
): ActionCtx => {
  const target = ctx.characters[targetId];
  const existingBleed = target.bleedSources[sourceId] ?? [];
  const bleed = existingBleed.find((source) => source.name === name);

  if (bleed) {
    bleed.stacks += stacks;
  } else {
    existingBleed.push({
      name,
      stacks,
      flatDamage,
      scalingDamage,
    });
  }
  target.bleedSources[sourceId] = existingBleed;
  return ctx;
};

export const removeBleedSource = (
  ctx: ActionCtx,
  sourceId: string,
  targetId: string,
  name: EffectName,
  stacks: number,
): ActionCtx => {
  const target = ctx.characters[targetId];
  const existingBleed = target.bleedSources[sourceId];
  const bleed = existingBleed.find((entry) => entry.name === name);
  if (!bleed) return ctx;

  bleed.stacks -= stacks;
  if (bleed.stacks <= 0) {
    const remaining = existingBleed.filter((entry) => entry !== bleed);
    if (remaining.length === 0) {
      delete target.bleedSources[sourceId];
    } else {
      target.bleedSources[sourceId] = remaining;
    }
  }
  return ctx;
};

export const processBleedDamage = (ctx: ActionCtx): ActionCtx => {
  const targetId = ctx.sourceId;
  const target = ctx.characters[targetId];
  if (!target || Object.keys(target.bleedSources).length === 0) return ctx;

  const mitigation = calcBladedMitigation(ctx, targetId);

  Object.entries(target.bleedSources).forEach(([ownerId, sources]) => {
    sources.forEach((source: BleedSourceState) => {
      const ownerPadding = ctx.characters[ownerId]?.stats.mastery.padding ?? 0;
      const damagePerTick =
        (source.flatDamage + ownerPadding * source.scalingDamage) *
        source.stacks;
      const actualDamage = limitToZero(trunc(damagePerTick) - mitigation);

      target.stats.core.life = limitToZero(
        target.stats.core.life - actualDamage,
      );
      const ownerName = ctx.characters[ownerId]?.name ?? "unknown";
      ctx.messages.steps?.push(
        `${target.name} bleeds for ${actualDamage} (${trunc(damagePerTick)} - ${mitigation}) from ${source.name} (${ownerName}).`,
      );
    });
  });

  return ctx;
};
