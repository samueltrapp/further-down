import { MvnOrTctType } from "../../../../types/events/turn.ts";

const pummel: MvnOrTctType = {
  name: "pummel",
  description: "Pummel description",
  speedCost: 12,
  maxTargets: 1,
  steps: [
    {
      type: "hit",
      accuracy: 75,
      damageType: "blunt",
      strength: 0.9,
    },
  ],
  tags: ["attack", "blunt", "single", "pure", "burden"],
};

export default pummel;
