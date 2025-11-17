import {MvnOrTctType} from "../../../../types/events/turn.ts";


const ache: MvnOrTctType = {
  description: "Ache description",
  speedCost: 15,
  maxTargets: 1,
  steps: [
    {
      damageType: "psychic",
      strength: 1.1,
    },
  ],
};

export default ache;