import { ManeuverType } from "../../../../types/equipables/actions.ts";

export const deluge: ManeuverType = {
  name: "deluge",
  description: "Deluge description",
  speedCost: 8,
  maxTargets: 3,
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
