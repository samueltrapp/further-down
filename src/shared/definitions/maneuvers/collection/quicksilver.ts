import {
  ManeuverName,
  ManeuverType,
} from "../../../../types/equipables/actions.ts";

export const quicksilver: ManeuverType = {
  name: ManeuverName.QUICKSILVER,
  description: "Quicksilver description",
  speedCost: 4,
  targetTeam: "enemy",
  maxTargets: 1,
  steps: [
    {
      type: "hit",
      accuracy: 90,
      damageType: "blunt",
      strength: 0.3,
    },
    {
      type: "hit",
      accuracy: 90,
      damageType: "blunt",
      strength: 0.3,
    },
    {
      type: "hit",
      accuracy: 90,
      damageType: "blunt",
      strength: 0.3,
    },
    {
      type: "hit",
      accuracy: 90,
      damageType: "blunt",
      strength: 0.3,
    },
  ],
  tags: ["attack", "multi", "pure", "bladed"],
};
