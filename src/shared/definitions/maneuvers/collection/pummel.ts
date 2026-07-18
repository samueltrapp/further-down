import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";

const pummel: ManeuverType = {
  name: "pummel",
  team: "player",
  description: "A single strong but unsteady blow.",
  speedCost: 6,
  perspective: "other",
  targetMethod: "select",
  maxTargets: 1,
  steps: [
    {
      type: "hit",
      accuracy: 50,
      damageType: "blunt",
      strength: 1.25,
    },
  ],
  tags: ["attack", "blunt", "single", "pure", "burden"],
};

export default pummel;
