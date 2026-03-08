import { ManeuverType } from "../../../../types/equipables/actions.ts";

export const bonk: ManeuverType = {
  name: "bonk",
  team: "enemy",
  description: "A gentle slap",
  speedCost: 5,
  targetTeam: "player",
  maxTargets: 1,
  steps: [
    {
      type: "hit",
      accuracy: 85,
      damageType: "blunt",
      strength: 1,
    },
  ],
  tags: ["attack", "single", "pure", "blunt"],
};
