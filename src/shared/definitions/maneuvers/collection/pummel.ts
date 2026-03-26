import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";

const pummel: ManeuverType = {
  name: "pummel",
  team: "player",
  description: "Pummel description",
  speedCost: 8,
  perspective: "other",
  targetMethod: "select",
  maxTargets: 1,
  steps: [
    {
      type: "hit",
      accuracy: 70,
      damageType: "blunt",
      strength: 1.4,
    },
  ],
  tags: ["attack", "blunt", "single", "pure", "burden"],
};

export default pummel;
