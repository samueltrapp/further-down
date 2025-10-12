import {MvnOrTctType} from "../../../../types/events/turn.ts";

const gentleSlap: MvnOrTctType = {
  speedCost: 4,
  maxTargets: 1,
  steps: [
    {
      damageType: "blunt",
      strength: 0.35,
    },
  ],
};

export default gentleSlap;