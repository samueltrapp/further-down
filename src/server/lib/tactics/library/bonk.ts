import { TacticType } from "../../../../types/equipables/actions.ts";

const bonk: TacticType = {
  name: "bonk",
  description: "Bonk description",
  speedCost: 4,
  maxTargets: 1,
  steps: [
    {
      damageType: "blunt",
      strength: 0.8,
    },
  ],
  tags: ["attack", "single", "pure", "blunt"],
};

export default bonk;
