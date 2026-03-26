import { BurdenName, EffectType } from "../../../types/equipables/effects.ts";
import anguish from "./collection/anguish.ts";

const burdens: [BurdenName, EffectType][] = [["anguish", anguish]];

export const burdenMap = new Map<BurdenName, EffectType>(burdens);
