import { ManeuverName } from "../../../types/equipables/maneuvers.ts";
import slap from "./library/slap.ts";
import { MvnOrTctType } from "../../../types/events/turn.ts";
import quicksilver from "./library/quicksilver.ts";
import fireburst from "./library/fireburst.ts";
import ache from "./library/ache.ts";

export const maneuverCollection: Record<ManeuverName, MvnOrTctType> = {
  slap,
  quicksilver,
  fireburst,
  ache
};
