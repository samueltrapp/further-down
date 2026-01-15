import { ManeuverType } from "../../../../types/equipables/actions.ts";

export const deluge: ManeuverType = {
  name: "deluge",
  description: "Deluge description",
  speedCost: 8,
  maxTargets: 3,
  accuracy: 80,
  steps: [
    {
      type: "hit",
      damageType: "elemental",
      strength: 0.5,
    },
  ],
  tags: ["attack"],
};
