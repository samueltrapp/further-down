import {MvnOrTctType} from "../../../../types/events/turn.ts";

const sporeBurst: MvnOrTctType = {
  speedCost: 7,
  maxTargets: 4,
  steps: [
    {
      damageType: "elemental",
      strength: 0.75,
    },
  ],
};

export default sporeBurst;