import {ManeuverName} from "./maneuvers.ts";
import {StatsType, TeamType} from "./stats.ts";

export enum GameActions {
    SELECT_ACTION = "SELECT_ACTION",
    SELECT_ENEMY = "SELECT_ENEMY",
    SYNC = "SYNC"
}

export type CharType = {
    id: string;
    name: string,
    playerId?: string;
    team: TeamType;
    stats: StatsType;
    lastTurn: number;
}

export type GameType = {
    characters: CharType[],
    gameId: string,
    turnNumber: number;
    turnOrder: string[],
};

export type GameMetaType = {
    games: GameType[],
    findGame: (gameId: string) => GameType | undefined,
    findGameIndex: (gameId: string) => number | undefined
};

export type TurnType = {
    gameId: string,
    maneuver: ManeuverName,
    targetIds: string[],
    issuerId: string;
};