import { ReactNode, useReducer } from "react";
import { GameActions, GameType } from "../../types/game.ts";
import { GameContext, GameDispatchContext, GameStateType } from "./GameContext";
import {ManeuverName} from "../../types/maneuvers.ts";

export type ActionTypes
    = { type: GameActions.SELECT_ACTION, payload: {allow: boolean, max: number, mnv: ManeuverName | ""}}
    | { type: GameActions.SELECT_ENEMY, payload: string | null }
    | { type: GameActions.SYNC, payload: GameType }

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [game, dispatch] = useReducer(gameReducer, {
        allowSelection: false,
        characters: [],
        gameId: "",
        maxEnemySelections: 0,
        selectedEnemyIds: [],
        selectedManeuver: "",
        turnNumber: 0,
        turnOrder: []
    });

    return (
        <GameContext.Provider value={game}>
            <GameDispatchContext.Provider value={dispatch}>
                {children}
            </GameDispatchContext.Provider>
        </GameContext.Provider>
    );
};

function gameReducer(game: GameStateType, action: ActionTypes) {
    switch (action.type) {

        case GameActions.SELECT_ACTION: {
            return {
                ...game,
                allowSelection: action.payload.allow,
                maxEnemySelections: action.payload.max,
                selectedManeuver: action.payload.mnv
            };
        }

        case GameActions.SELECT_ENEMY: {
            const addOrRemove = (newSelection: string | null) => {
                if (!newSelection) return [];
                const pivot = game.selectedEnemyIds.findIndex((enemyId) => enemyId === newSelection);
                if (pivot >= 0) {
                    return game.selectedEnemyIds.slice(0, pivot).concat(game.selectedEnemyIds.slice(pivot + 1));
                }
                else {
                    const overwriteIndex = game.maxEnemySelections > 1 ? -(game.maxEnemySelections - 1) : game.selectedEnemyIds.length;
                    const needsOverwrite = game.selectedEnemyIds.length >= game.maxEnemySelections;
                    const limitedEnemyIds = game.selectedEnemyIds.slice(needsOverwrite ? overwriteIndex : 0);
                    limitedEnemyIds.push(newSelection);
                    return limitedEnemyIds;
                }
            }

            return {
                ...game,
                selectedEnemyIds: addOrRemove(action.payload)
            };
        }

        case GameActions.SYNC: {
            return {
                ...game,
                ...action.payload
            }
        }
    }
}