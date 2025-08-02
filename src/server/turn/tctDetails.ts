import { MvnOrTctType } from "../../types/turns.ts";
import { TacticName } from "../../types/tactics.ts";

export const tctDetails: Record<TacticName, MvnOrTctType> = {
  sporeBurst: {
    speedCost: 7,
    maxTargets: 4,
    actions: [
      {
        damageType: "elemental",
        strength: 0.75,
      },
    ],
  },
  gentleSlap: {
    speedCost: 4,
    maxTargets: 1,
    actions: [
      {
        damageType: "blunt",
        strength: 0.35,
      },
    ],
  },
};
