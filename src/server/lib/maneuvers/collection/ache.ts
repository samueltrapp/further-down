import { ManeuverType } from "../../../../types/equipables/actions.ts";

const ache: ManeuverType = {
  name: "ache",
  description: "Ache description",
  speedCost: 11,
  maxTargets: 1,
  accuracy: 85,
  steps: [
    {
      type: "hit",
      damageType: "psychic",
      strength: 1.1,
    },
    {
      type: "effect",
    }
  ],
  tags: ["attack", "single", "pure", "psychic", "burden"],
};

export default ache;
