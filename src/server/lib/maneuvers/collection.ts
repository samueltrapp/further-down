import { ManeuverName } from "../../../types/equipables/maneuvers.ts";
import slap from "./collection/slap.ts";
import { MvnOrTctType } from "../../../types/events/turn.ts";
import quicksilver from "./collection/quicksilver.ts";
import fireburst from "./collection/fireburst.ts";
import ache from "./collection/ache.ts";

export const maneuverCollection: Record<ManeuverName, MvnOrTctType> = {
  slap,
  quicksilver,
  fireburst,
  ache
};
