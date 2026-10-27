import { BlessingType } from "../../../../types/equipables/blessings.ts";
import { TriggerFn } from "../../../../types/equipables/enchantments.ts";
import { limitToZero, trunc } from "../../../../server/utils/battle.ts";

const SCALING_FACTOR = 1;

const tempestFn: TriggerFn = (ctx, sourceId, targetId) => {
  const { characters } = ctx;
  const source = characters[sourceId];
  const target = characters[targetId];
  const damage = trunc(
    SCALING_FACTOR * source.stats.mastery.elemental * ctx.round,
  );

  ctx.messages.steps?.push(
    `TEMPEST // ${damage} from ${source.name} to ${target.name}`,
  );
  target.stats.core.life = limitToZero(target.stats.core.life - damage);
  return ctx;
};

const tempest: BlessingType = {
  name: "tempest",
  description: "Deal damage to all enemies at the end of every round.",
  trigger: "round-end",
  selection: "all-enemies",
  priority: 0,
  onTrigger: tempestFn,
};

export default tempest;
