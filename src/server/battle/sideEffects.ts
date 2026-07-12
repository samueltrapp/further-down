import { ActionCtx } from "../../types/events/actionCtx.ts";
import {
  Activation,
  EnchantmentType,
  Selection,
} from "../../types/equipables/enchantments.ts";
import { blessingMap } from "../../shared/definitions/blessings/sets.ts";
import { enchantmentMap } from "../../shared/definitions/enchantments/sets.ts";
import { StepType } from "../../types/equipables/maneuvers.ts";
import { BlessingType } from "../../types/equipables/blessings.ts";
import { applyEffect } from "./effect.ts";
import { EffectName } from "../../types/equipables/effects.ts";

const getRelevantIds = (ctx: ActionCtx, trigger: Activation) => {
  const allIds = Object.keys(ctx.characters);

  switch (trigger) {
    case "attack":
      return [ctx.sourceId];
    case "defend":
      return ctx.targetIds;
    case "turn-start":
    case "turn-end":
    case "round-start":
    case "round-end":
    case "battle-start":
    case "battle-end":
    default:
      return allIds;
  }
};

const getSelectionIds = (
  ctx: ActionCtx,
  referenceId: string,
  selection: Selection | undefined,
) => {
  const characterEntries = Object.entries(ctx.characters);
  const referenceCharacter = ctx.characters[referenceId];
  const team = referenceCharacter.team;
  const allAllies = characterEntries
    .filter((entry) => entry[1].team === team)
    .map((entry) => entry[0]);
  const allEnemies = characterEntries
    .filter((entry) => entry[1].team !== team)
    .map((entry) => entry[0]);

  switch (selection) {
    case "self":
      return [ctx.sourceId];
    case "targets":
      return ctx.targetIds;
    case "all-allies":
      return allAllies;
    case "all-enemies":
      return allEnemies;
    // case "randomAlly":
    // case "randomEnemy":
    default:
      return [];
  }
};

/* Resolves a set of triggered enchantments/blessings owned by one character.
   Both share the same trigger/selection/effect shape, so they're processed
   identically here. `ownerId` is the character whose equipment is triggering,
   not ctx.sourceId — round/battle triggers sweep every character in turn,
   so ctx.sourceId only reflects whoever's turn is currently resolving. */
const resolveTriggered = (
  ctx: ActionCtx,
  ownerId: string,
  entries: (EnchantmentType | BlessingType)[],
  step?: StepType,
): ActionCtx => {
  const sorted = [...entries].sort((a, b) => a.priority - b.priority);

  sorted.forEach((entry) => {
    const selections = getSelectionIds(ctx, ownerId, entry.selection);
    selections?.forEach((selection) => {
      if (entry.onTrigger) {
        ctx = entry.onTrigger(ctx, ownerId, selection, step);
      }
      if (entry.effect) {
        ctx = applyEffect(
          ctx,
          ownerId,
          [selection],
          entry.name as EffectName,
          1,
          step,
        );
      }
    });
  });

  return ctx;
};

export const handleSideEffects = (
  ctx: ActionCtx,
  activation: Activation,
  step?: StepType,
): ActionCtx => {
  const characters = ctx.characters;
  const relevantIds = getRelevantIds(ctx, activation);

  Object.values(characters).forEach((character) => {
    if (!relevantIds.includes(character.id)) return;

    const enchantments: EnchantmentType[] = [];
    character.equipped.enchantments.forEach((enchantment) => {
      const enchantmentDfn = enchantmentMap.get(enchantment);
      if (enchantmentDfn?.trigger === activation) {
        enchantments.push(enchantmentDfn);
      }
    });

    const blessings: BlessingType[] = [];
    character.equipped.blessings.forEach((blessing) => {
      const blessingDfn = blessingMap.get(blessing);
      if (blessingDfn?.trigger === activation) {
        blessings.push(blessingDfn);
      }
    });

    ctx = resolveTriggered(ctx, character.id, enchantments, step);
    ctx = resolveTriggered(ctx, character.id, blessings, step);
  });

  return ctx;
};
