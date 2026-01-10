import { ManeuverType } from "../../../../types/equipables/actions.ts";

const quicksilver: ManeuverType = {
  name: "quicksilver",
  description: "Quicksilver description",
  speedCost: 4,
  maxTargets: 1,
  accuracy: 90,
  steps: [
    {
      damageType: "blunt",
      strength: 0.3,
    },
    {
      damageType: "blunt",
      strength: 0.3,
    },
    {
      damageType: "blunt",
      strength: 0.3,
    },
    {
      damageType: "blunt",
      strength: 0.3,
    },
  ],
  tags: ["attack", "multi", "pure", "bladed"],
};

export default quicksilver;
