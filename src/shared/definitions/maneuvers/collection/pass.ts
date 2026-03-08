import { ManeuverType } from "../../../../types/equipables/actions.ts";

export const pass: ManeuverType = {
  name: "pass",
  team: "enemy",
  description: "Skips turn",
  speedCost: 10,
  perspective: "own",
  targetMethod: "self",
  maxTargets: 0,
  steps: [
    {
      type: "effect",
    },
  ],
  tags: [],
};
