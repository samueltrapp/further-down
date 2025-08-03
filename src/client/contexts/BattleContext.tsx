import { ActionDispatch, createContext } from "react";
import { GameType } from "../../types/game.ts";
import { BattleActionTypes } from "./BattleProvider.tsx";
import { ManeuverName } from "../../types/maneuvers.ts";
import { WeaponName } from "../../types/weapons.ts";

export type BattleStateType = Omit<GameType, "hasStarted" | "playerCount"> & {
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
