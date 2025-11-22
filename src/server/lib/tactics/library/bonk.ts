import { MvnOrTctType } from "../../../../types/events/turn.ts";

const bonk: MvnOrTctType = {
  speedCost: 4,
  maxTargets: 1,
  steps: [
    {
      damageType: "blunt",
      strength: 1.2,
      base: 5,
    },
  ],
};

export default bonk;
