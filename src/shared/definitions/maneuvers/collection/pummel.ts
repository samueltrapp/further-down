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
      accuracy: 50,
      damageType: "blunt",
      strength: 2,
    },
  ],
  tags: ["attack", "blunt", "single", "pure", "burden"],
};

export default pummel;
