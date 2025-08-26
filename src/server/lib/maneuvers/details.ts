import { ManeuverType } from "../../../types/equipables/maneuvers.ts";

export const maneuverCollection: ManeuverType[] = [
  {
    name: "slap",
    description: "Slap description",
    speedCost: 12,
    maxTargets: 1,
    steps: [
      {
        damageType: "blunt",
        strength: 0.9,
      },
    ],
  },
  {
    name: "quicksilver",
    description: "Quicksilver description",
    speedCost: 4,
    maxTargets: 1,
    steps: [
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
  {
    name: "fireburst",
    description: "Fireburst description",
    speedCost: 8,
    maxTargets: 3,
    steps: [
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
  {
    name: "ache",
    description: "Ache description",
    speedCost: 15,
    maxTargets: 1,
    steps: [
      {
        damageType: "psychic",
        strength: 1.1,
      },
    ],
  },
];
