import { ActionDispatch, createContext } from "react";
import { GameType } from "../../types/game.ts";
import { ActionTypes } from "./GameProvider";
import {ManeuverName} from "../../types/maneuvers.ts";

type UnitSelectionType = {
    allowSelection: boolean;
    maxEnemySelections: number;
    selectedEnemyIds: string[];
    selectedManeuver: ManeuverName;
}

export type GameStateType = GameType & UnitSelectionType;

export const GameContext = createContext<GameStateType | null>(null);
export const GameDispatchContext = createContext<ActionDispatch<[action: ActionTypes]> | null>(null);