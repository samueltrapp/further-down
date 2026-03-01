import {
  TacticName,
  TacticType,
} from "../../../../types/equipables/actions.ts";

export const bonk: TacticType = {
  name: TacticName.BONK,
  description: "A gentle slap that grows stronger each round",
  speedCost: 5,
  targetTeam: "player",
  maxTargets: 1,
  steps: [
    {
      type: "hit",
      accuracy: 85,
      damageType: "blunt",
      strength: 1,
    },
  ],
  tags: ["attack", "single", "pure", "blunt"],
};
