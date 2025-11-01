import { MvnOrTctType } from "../../../types/events/turn.ts";
import { TacticName } from "../../../types/equipables/tactics.ts";

import gentleSlap from "./collection/gentleSlap.ts";
import sporeBurst from "./collection/sporeBurst.ts";

export const tctDetails: Record<TacticName, MvnOrTctType> = {
  gentleSlap,
  sporeBurst,
};
