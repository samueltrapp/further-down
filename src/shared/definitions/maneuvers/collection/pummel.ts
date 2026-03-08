import { ManeuverType } from "../../../../types/equipables/actions.ts";

const pummel: ManeuverType = {
  name: "pummel",
  team: "player",
  description: "Pummel description",
  speedCost: 12,
  targetTeam: "enemy",
  maxTargets: 1,
  steps: [
    {
      type: "hit",
      accuracy: 75,
      damageType: "blunt",
      strength: 0.9,
    },
  ],
  tags: ["attack", "blunt", "single", "pure", "burden"],
};

export default pummel;
