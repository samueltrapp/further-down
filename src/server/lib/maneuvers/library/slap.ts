import {MvnOrTctType} from "../../../../types/events/turn.ts";

const slap: MvnOrTctType = {
  description: "Slap description",
  speedCost: 12,
  maxTargets: 1,
  steps: [
    {
      damageType: "blunt",
      strength: 0.9,
    }
  ]
};

export default slap;