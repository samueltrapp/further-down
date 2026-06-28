import { ActionCtx } from "../../types/events/actionCtx.ts";
import { armorMap } from "../../shared/definitions/armors/sets.ts";
import { limitToZero, trunc } from "../utils/battle.ts";

/* Elemental mitigation using armor's resistance and dampening affinities */
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
  targetIds: string[],
  damagePerSpeed: number,
): ActionCtx => {
  const ownerId = ctx.sourceId;
  targetIds.forEach((targetId) => {
    const target = ctx.characters[targetId];
    if (!target) return;
    const existing = target.burnSources[ownerId];
    if (existing) {
      existing.damagePerSpeed += damagePerSpeed;
    } else {
      target.burnSources[ownerId] = {
        damagePerSpeed,
        lastSpeedElapsed: ctx.speedElapsed,
      };
    }
  });
  return ctx;
};

export const removeBurnSource = (
  ctx: ActionCtx,
  targetIds: string[],
  ownerId: string,
  contribution: number,
): ActionCtx => {
  targetIds.forEach((targetId) => {
    const target = ctx.characters[targetId];
    const source = target.burnSources[ownerId];
    if (!target || !source) return;

    source.damagePerSpeed -= contribution;
    if (source.damagePerSpeed <= 0) delete target.burnSources[ownerId];
  });
  return ctx;
};

export const processBurnDamage = (ctx: ActionCtx): ActionCtx => {
  const targetId = ctx.sourceId;
  const target = ctx.characters[targetId];
  if (!target || Object.keys(target.burnSources).length === 0) return ctx;

  const mitigation = calcElementalMitigation(ctx, targetId);

  Object.entries(target.burnSources).forEach(([ownerId, source]) => {
    const elapsed = ctx.speedElapsed - source.lastSpeedElapsed;
    if (elapsed <= 0) return;

    const rawDamage = trunc(source.damagePerSpeed * elapsed);
    const actualDamage = limitToZero(rawDamage - mitigation);

    target.stats.core.life = limitToZero(target.stats.core.life - actualDamage);
    const ownerName = ctx.characters[ownerId]?.name ?? "unknown";
    ctx.messages.steps?.push(
      `${target.name} burns for ${actualDamage} (${rawDamage} - ${mitigation}) from ${ownerName}.`,
    );
    source.lastSpeedElapsed = ctx.speedElapsed;
  });

  return ctx;
};
