import { TacticType } from "../../../../types/equipables/actions.ts";

export const bonk: TacticType = {
  name: "bonk",
  description: "Bonk description",
  speedCost: 4,
  maxTargets: 1,
  steps: [
    {
      type: "hit",
      accuracy: 85,
      damageType: "blunt",
      strength: 0.8,
    },
  ],
  tags: ["attack", "single", "pure", "blunt"],
};
