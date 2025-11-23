import { TacticType } from "../../../../types/equipables/actions.ts";

const sporeBurst: TacticType = {
  name: "sporeBurst",
  description: "Spore burst description",
  speedCost: 7,
  maxTargets: 4,
  steps: [
    {
      damageType: "elemental",
      strength: 0.75,
    },
  ],
};

export default sporeBurst;
