import { BlessingType } from "../../../../types/equipables/blessings.ts";
import eternalFlameEffect from "../../effects/collection/eternalFlame.ts";

const eternalFlame: BlessingType = {
  name: "eternal flame",
  description:
    "At the start of your turn, sears every enemy with a small, lingering burn.",
  trigger: "round-start",
  selection: "all-enemies",
  effect: eternalFlameEffect,
  priority: 0,
};

export default eternalFlame;
