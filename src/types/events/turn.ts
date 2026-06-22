import { ManeuverName } from "../equipables/maneuvers.ts";
import { WeaponName } from "../equipables/weapons.ts";

type BaseTurnType = {
  gameId: string;
  sourceId: string;
  maneuver: ManeuverName;
  targetIds: string[];
};

export type PlayerTurnType = BaseTurnType & {
  team: "player";
  weapon: WeaponName;
};

export type EnemyTurnType = BaseTurnType & {
  team: "enemy";
};
