import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";

export const headbutt: ManeuverType = {
  name: "headbutt",
  team: "player",
  description: "Significantly reduce the dodge of one target and yourself.",
  speedCost: 3,
  perspective: "other",
  targetMethod: "select",
  maxTargets: 1,
  steps: [
    {
      type: "effect",
      effect: "headbutt",
    },
    {
      type: "effect",
      effect: "headbutt",
      targetOverride: "self",
    },
  ],
  tags: ["burden"],
};
