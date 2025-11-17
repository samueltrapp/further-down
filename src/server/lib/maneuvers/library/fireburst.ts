import {MvnOrTctType} from "../../../../types/events/turn.ts";

const fireburst: MvnOrTctType =  {
  description: "Fireburst description",
  speedCost: 8,
  maxTargets: 3,
  steps: [
    {
      damageType: "elemental",
      strength: 0.15,
    },
    {
      damageType: "elemental",
      strength: 0.5,
    },
  ],
};

export default fireburst;