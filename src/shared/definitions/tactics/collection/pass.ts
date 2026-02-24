import { TacticType } from "../../../../types/equipables/actions.ts";

export const pass: TacticType = {
  name: "pass",
  description: "Skips turn",
  speedCost: 10,
  targetTeam: "enemy",
  maxTargets: 0,
  steps: [
    {
      type: "effect",
    },
  ],
  tags: ["attack", "single", "pure", "blunt"],
};
