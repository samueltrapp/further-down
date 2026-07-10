import { EffectName, EffectType } from "../../../types/equipables/effects.ts";
import anguish from "./collection/anguish.ts";
import combustion from "./collection/combustion.ts";
import eternalFlame from "./collection/eternalFlame.ts";
import headbutt from "./collection/headbutt.ts";
import lacerate from "./collection/lacerate.ts";
import sharpenTheBlade from "./collection/sharpenTheBlade.ts";
import verve from "./collection/verve.ts";
import tallShadow from "./collection/tallShadow.ts";

const effects: [EffectName, EffectType][] = [
  ["anguish", anguish],
  ["combustion", combustion],
  ["eternal flame", eternalFlame],
  ["headbutt", headbutt],
  ["lacerate", lacerate],
  ["sharpen the blade", sharpenTheBlade],
  ["verve", verve],
  ["tall shadow", tallShadow],
];

export const effectMap = new Map<EffectName, EffectType>(effects);
