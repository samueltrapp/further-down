import { ActionDispatch, createContext } from "react";
import { BattleType } from "../../types/game.ts";
import { BattleActionTypes } from "./BattleProvider.tsx";
import { ManeuverName } from "../../types/equipables/maneuvers.ts";
import { WeaponName } from "../../types/equipables/weapons.ts";

export type BattleStateType = BattleType & {
  enableConfirmation: boolean;
  maxEnemySelections: number;
  selectedEnemyIds: string[];
  selectedManeuver: ManeuverName | undefined;
  selectedWeapon: WeaponName | undefined;
};

export const BattleContext = createContext<BattleStateType | null>(null);
export const BattleDispatchContext = createContext<ActionDispatch<
  [action: BattleActionTypes]
> | null>(null);
