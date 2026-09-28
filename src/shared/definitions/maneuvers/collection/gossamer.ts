import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";

export const gossamer: ManeuverType = {
  name: "gossamer",
  team: "player",
  description: "Grants an ally evasion until the end of the round",
  speedCost: 8,
  perspective: "own",
  targetMethod: "select",
  maxTargets: 1,
  steps: [
    {
      type: "effect",
      effect: "gossamer",
      stacks: 1,
    },
  ],
  tags: ["favor"],
};
