import { MvnOrTctType } from "../../../types/events/turn.ts";
import { TacticName } from "../../../types/equipables/tactics.ts";

import bonk from "./library/bonk.ts";
import sporeBurst from "./library/sporeBurst.ts";

export const tacticCollection: Record<TacticName, MvnOrTctType> = {
  bonk: bonk,
  sporeBurst: sporeBurst,
};
