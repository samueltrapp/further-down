import { EnchantmentType } from "../../../../types/equipables/enchantments.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";
import { roll } from "../../../utils.ts";
import {
  extractSuccessfulHits,
  limitToBounds,
  trunc,
} from "../../../../server/utils/battle.ts";

const BASE_CHANCE = 15;
const DISCIPLINE_CHANCE_SCALING = 0.1;
const BASE_EFFICACY = 50;
const MASTERY_EFFICACY_SCALING = 0.05;

const onTrigger = (ctx: ActionCtx, applicableIds: string[]) => {
  const sourceId = applicableIds[0]; // For "attack" trigger, only the attacker
  const source = ctx.characters[sourceId];
  const procChance =
    BASE_CHANCE + DISCIPLINE_CHANCE_SCALING * source.stats.physical;
  const proc = roll(procChance);
  const hits = extractSuccessfulHits(ctx);

  if (!source || !proc || hits.length === 0) {
    return ctx;
  }

  // Calculate lifesteal
  const lifestealCoefficient =
    (BASE_EFFICACY + MASTERY_EFFICACY_SCALING * source.stats.physical) / 100;
  const totalHeal = hits.reduce(
    (sum, hit) => trunc(sum + hit.damage * lifestealCoefficient),
    0,
  );

  // Apply healing to source
  const newLife = source.stats.life + totalHeal;
  source.stats.life = limitToBounds(newLife, source.stats.maxLife);

  // Log the healing
  ctx.messages.steps?.push(`RED FANG: ${totalHeal} Life.`);

  return ctx;
};

export const redFangEnch: EnchantmentType = {
  name: "red fang",
  description: "Restore some life on a physical hit",
  trigger: "attack",
  priority: 10,
  onTrigger,
};
