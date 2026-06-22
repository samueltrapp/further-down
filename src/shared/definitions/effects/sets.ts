import { EffectName, EffectType } from "../../../types/equipables/effects.ts";
import anguish from "./collection/anguish.ts";
import headbutt from "./collection/headbutt.ts";
import sharpenTheBlade from "./collection/sharpenTheBlade.ts";
import verve from "./collection/verve.ts";
import tallShadow from "./collection/tallShadow.ts";

const effects: [EffectName, EffectType][] = [
  ["anguish", anguish],
  ["headbutt", headbutt],
  ["sharpen the blade", sharpenTheBlade],
  ["verve", verve],
  ["tall shadow", tallShadow],
];

export const effectMap = new Map<EffectName, EffectType>(effects);
