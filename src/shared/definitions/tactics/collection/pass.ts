import {
  TacticName,
  TacticType,
} from "../../../../types/equipables/actions.ts";

export const pass: TacticType = {
  name: TacticName.PASS,
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
