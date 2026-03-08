import { ManeuverType } from "../../../../types/equipables/actions.ts";

export const quicksilver: ManeuverType = {
  name: "quicksilver",
  team: "player",
  description: "Quicksilver description",
  speedCost: 4,
  perspective: "other",
  targetMethod: "select",
  maxTargets: 1,
  steps: [
    {
      type: "hit",
      accuracy: 90,
      damageType: "bladed",
      strength: 0.3,
    },
    {
      type: "hit",
      accuracy: 90,
      damageType: "bladed",
      strength: 0.3,
    },
    {
      type: "hit",
      accuracy: 90,
      damageType: "bladed",
      strength: 0.3,
    },
    {
      type: "hit",
      accuracy: 90,
      damageType: "bladed",
      strength: 0.3,
    },
  ],
  tags: ["attack", "multi", "pure", "bladed"],
};
