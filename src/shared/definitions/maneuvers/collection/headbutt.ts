import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";

export const headbutt: ManeuverType = {
  name: "headbutt",
  team: "player",
  description: "Significantly reduce the evasion of one target and yourself.",
  speedCost: 4,
  perspective: "other",
  targetMethod: "select",
  maxTargets: 1,
  steps: [
    {
      type: "effect",
      effect: "headbutt",
    },
  ],
  tags: ["burden"],
};
