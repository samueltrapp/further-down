import { ManeuverType } from "../../../../types/equipables/actions.ts";

export const deluge: ManeuverType = {
  name: "deluge",
  team: "player",
  description: "Deluge description",
  speedCost: 8,
  targetTeam: "enemy",
  maxTargets: 4,
  steps: [
    {
      type: "hit",
      accuracy: 80,
      damageType: "elemental",
      strength: 0.5,
    },
  ],
  tags: ["attack"],
};
