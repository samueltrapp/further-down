import {
  ManeuverName,
  ManeuverType,
} from "../../../../types/equipables/actions.ts";

const ache: ManeuverType = {
  name: ManeuverName.ACHE,
  description: "Ache description",
  speedCost: 11,
  targetTeam: "enemy",
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
