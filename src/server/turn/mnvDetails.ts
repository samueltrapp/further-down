import { ManeuverName } from "../../types/maneuvers.ts";
import { MvnOrTctType } from "../../types/turns.ts";

export const mnvDetails: Record<ManeuverName, MvnOrTctType> = {
  slap: {
    speedCost: 12,
    maxTargets: 1,
    actions: [
      {
        damageType: "blunt",
        strength: 0.9,
      },
    ],
  },
  quicksilver: {
    speedCost: 4,
    maxTargets: 1,
    actions: [
      {
        damageType: "blunt",
        strength: 0.3,
      },
      {
        damageType: "blunt",
        strength: 0.3,
      },
      {
        damageType: "blunt",
        strength: 0.3,
      },
      {
        damageType: "blunt",
        strength: 0.3,
      },
    ],
  },
  fireburst: {
    speedCost: 8,
    maxTargets: 3,
    actions: [
      {
        damageType: "elemental",
        strength: 0.15,
      },
      {
        damageType: "elemental",
        strength: 0.5,
      },
    ],
  },
  ache: {
    speedCost: 15,
    maxTargets: 1,
    actions: [
      {
        damageType: "psychic",
        strength: 1.1,
      },
    ],
  },
};
