import { ArmorType } from "../../types/equipables/armors.ts";
import { StatsType } from "../../types/individual/stats.ts";
import { trunc } from "./battle.ts";

export const speedMultiplier = (finesse: number) => finesse * 0.12 + 0.6;
export const lifeMultiplier = (protection: number) => protection * 0.36 + 3.6;

/* Updates protection, finesse, and all derived life/speed stats from the equipped armor. */
export function deriveArmorStats(
  stats: StatsType,
  armor: ArmorType | null,
): StatsType {
  if (!armor) return stats;

  const maxLife = trunc(stats.core.vitality * lifeMultiplier(armor.protection));
  const currentLife = trunc((stats.core.life / stats.core.maxLife) * maxLife);

  const maxSpeed = trunc(
    stats.core.initiative * speedMultiplier(armor.finesse),
  );

  stats.core.protection = armor.protection;
  stats.core.finesse = armor.finesse;
  stats.core.life = currentLife;
  stats.core.maxLife = maxLife;
  stats.core.speed = maxSpeed;
  stats.core.maxSpeed = maxSpeed;

  return stats;
}
