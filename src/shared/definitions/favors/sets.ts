import { EffectType, FavorName } from "../../../types/equipables/effects.ts";
import verve from "./collection/verve.ts";
import sharpenTheBladeFv from "./collection/sharpenTheBlade.ts";

const favors: [FavorName, EffectType][] = [
  ["sharpen the blade", sharpenTheBladeFv],
  ["verve", verve],
];

export const favorMap = new Map<FavorName, EffectType>(favors);
