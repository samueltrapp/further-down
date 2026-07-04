import { ManeuverType } from "../../../../types/equipables/maneuvers.ts";

const combustion: ManeuverType = {
  name: "combustion",
  team: "player",
  description: "Set a unit on fire",
  speedCost: 4,
  perspective: "other",
  targetMethod: "select",
  maxTargets: 1,
  steps: [
    {
      type: "effect",
      effect: "combustion",
      stacks: 1,
    },
  ],
  tags: ["burden", "elemental", "dot", "single"],
};

export default combustion;
