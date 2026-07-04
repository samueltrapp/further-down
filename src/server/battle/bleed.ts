import { ActionCtx } from "../../types/events/actionCtx.ts";
import { armorMap } from "../../shared/definitions/armors/sets.ts";
import { limitToZero, trunc } from "../utils/battle.ts";

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
  targetIds: string[],
  flatDamage: number,
  scalingDamage: number,
): ActionCtx => {
  const ownerId = ctx.sourceId;
  targetIds.forEach((targetId) => {
    const target = ctx.characters[targetId];
    if (!target) return;
    const existing = target.bleedSources[ownerId];
    if (existing) {
      existing.flatDamage += flatDamage;
      existing.scalingDamage += scalingDamage;
    } else {
      target.bleedSources[ownerId] = {
        flatDamage,
        scalingDamage,
      };
    }
  });
  return ctx;
};

export const removeBleedSource = (
  ctx: ActionCtx,
  targetIds: string[],
  ownerId: string,
  flatDamage: number,
  scalingDamage: number,
): ActionCtx => {
  targetIds.forEach((targetId) => {
    const target = ctx.characters[targetId];
    if (!target) return;
    const source = target.bleedSources[ownerId];
    if (!source) return;
    source.flatDamage -= flatDamage;
    source.scalingDamage -= scalingDamage;
    if (source.flatDamage <= 0 && source.scalingDamage <= 0)
      delete target.bleedSources[ownerId];
  });
  return ctx;
};

export const processBleedDamage = (ctx: ActionCtx): ActionCtx => {
  const targetId = ctx.sourceId;
  const target = ctx.characters[targetId];
  if (!target || Object.keys(target.bleedSources).length === 0) return ctx;

  const mitigation = calcBladedMitigation(ctx, targetId);

  Object.entries(target.bleedSources).forEach(([ownerId, source]) => {
    const ownerPadding = ctx.characters[ownerId]?.stats.mastery.padding ?? 0;
    const damagePerTick =
      source.flatDamage + ownerPadding * source.scalingDamage;
    const actualDamage = limitToZero(trunc(damagePerTick) - mitigation);

    target.stats.core.life = limitToZero(target.stats.core.life - actualDamage);
    const ownerName = ctx.characters[ownerId]?.name ?? "unknown";
    ctx.messages.steps?.push(
      `${target.name} bleeds for ${actualDamage} (${trunc(damagePerTick)} - ${mitigation}) from ${ownerName}.`,
    );
  });

  return ctx;
};
