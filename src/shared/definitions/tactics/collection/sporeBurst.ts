import { TacticType } from "../../../../types/equipables/actions.ts";

const sporeBurst: TacticType = {
  name: "sporeBurst",
  description: "Spore burst description",
  speedCost: 7,
  targetTeam: "player",
  maxTargets: 4,
  steps: [
    {
      type: "hit",
      accuracy: 75,
      damageType: "elemental",
      strength: 0.75,
    },
  ],
  tags: ["attack"],
};

export default sporeBurst;
