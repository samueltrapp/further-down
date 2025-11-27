import { ManeuverType } from "../../../../types/equipables/actions.ts";

const ache: ManeuverType = {
  name: "ache",
  description: "Ache description",
  speedCost: 11,
  maxTargets: 1,
  steps: [
    {
      damageType: "psychic",
      strength: 1.1,
    },
  ],
};

export default ache;
