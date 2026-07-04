import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";

const lacerate: ManeuverType = {
  name: "lacerate",
  team: "player",
  description: "Cut an enemy, causing them to bleed",
  speedCost: 4,
  perspective: "other",
  targetMethod: "select",
  maxTargets: 1,
  steps: [
    {
      type: "effect",
      effect: "lacerate",
      stacks: 1,
    },
  ],
  tags: ["burden", "bladed", "dot", "single"],
};

export default lacerate;
