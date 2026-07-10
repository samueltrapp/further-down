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
    case "allAllies":
      return allAllies;
    case "allEnemies":
      return allEnemies;
    // case "randomAlly":
    // case "randomEnemy":
    default:
      return [];
  }
};

export const handleSideEffects = (
  ctx: ActionCtx,
  activation: Activation,
  step?: StepType,
): ActionCtx => {
  const characters = ctx.characters;
  const relevantIds = getRelevantIds(ctx, activation);

  Object.values(characters).forEach((character) => {
    // Enchantments
    if (relevantIds.includes(character.id)) {
      let enchantments: EnchantmentType[] = [];

      character.equipped.enchantments.forEach((enchantment) => {
        const enchantmentDfn = enchantmentMap.get(enchantment);
        if (enchantmentDfn?.trigger === activation) {
          enchantments.push(enchantmentDfn);
        }
      });

      // Set resolution order by priority
      enchantments = enchantments.sort((a, b) => a.priority - b.priority);

      enchantments.forEach((enchantment) => {
        const selections = getSelectionIds(
          ctx,
          ctx.sourceId,
          enchantment.selection,
        );
        selections?.forEach((selection) => {
          if (enchantment.onTrigger) {
            ctx = enchantment.onTrigger(ctx, character.id, selection, step);
          }
          if (enchantment.effect) {
            ctx = enchantment.effect.onApply(
              ctx,
              character.id,
              selection,
              step,
            );
          }
        });
      });
    }

    // Blessings
    let blessings: BlessingType[] = [];

    character.equipped.blessings.forEach((enchantment) => {
      const blessingDfn = blessingMap.get(enchantment);
      if (blessingDfn?.trigger === activation) {
        blessings.push(blessingDfn);
      }
    });

    // Set resolution order by priority
    blessings = blessings.sort((a, b) => a.priority - b.priority);

    blessings.forEach((blessing) => {
      const selections = getSelectionIds(ctx, ctx.sourceId, blessing.selection);
      selections?.forEach((selection) => {
        if (blessing.onTrigger) {
          ctx = blessing.onTrigger(ctx, character.id, selection, step);
        }
        if (blessing.effect) {
          ctx = blessing.effect.onApply(ctx, character.id, selection, step);
        }
      });
    });
  });

  return ctx;
};
