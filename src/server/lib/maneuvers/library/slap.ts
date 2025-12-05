import { MvnOrTctType } from "../../../../types/events/turn.ts";

const slap: MvnOrTctType = {
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
  tags: ["attack", "blunt", "single", "pure", "burden"],
};

export default slap;
