import { ManeuverType } from "../../../../types/equipables/actions.ts";

const ache: ManeuverType = {
  name: "ache",
  team: "player",
  description: "Ache description",
  speedCost: 7,
  perspective: "other",
  targetMethod: "select",
  maxTargets: 1,
  steps: [
    {
      type: "hit",
      accuracy: 85,
      damageType: "psychic",
      strength: 1.1,
    },
    {
      type: "effect",
    },
  ],
  tags: ["attack", "single", "pure", "psychic", "burden"],
};

export default ache;
