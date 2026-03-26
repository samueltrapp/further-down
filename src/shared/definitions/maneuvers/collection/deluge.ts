import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";

export const deluge: ManeuverType = {
  name: "deluge",
  team: "player",
  description: "Deluge description",
  speedCost: 8,
  perspective: "other",
  targetMethod: "all",
  maxTargets: 0,
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
