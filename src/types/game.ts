import {ManeuverName} from "./maneuvers.ts";

export enum GameActions {
    SELECT_ACTION = "SELECT_ACTION",
    SELECT_ENEMY = "SELECT_ENEMY",
    SYNC = "SYNC"
}

export type TeamType = "player" | "enemy";

export type StatsType = {
    hitPoints: number,  // Hp
    speed: number       // Spd
    physical: number,   // Ph
    blunt: number,      // Blt
    sharp: number,      // Shp
    armor: number,      // Ar
    padding: number,    // Pdd
    plating: number,    // Plt
    magical: number,    // Mg
    elemental: number,  // Elm
    psychic: number,    // Psy
    resistance: number, // Rs
    dampening: number,  // Dmp
    shielding: number,  // Shl
    martial: number,    // Mr
    accuracy: number,   // Acc
    evasion: number,    // Evn
    mystic: number,     // My
    discipline: number, // Dsp
    absorption: number, // Abs
};

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