export enum GameActions {
    ATTACK = "ATTACK",
    SELECT = "SELECT",
    SYNC = "SYNC"
}

export type TeamType = "player" | "enemy";

export type StatsType = {
    hitPoints: number,  // Hp
    physical: number,   // Ph
    blunt: number,      // Blt
    sharp: number,      // Shp
    armor: number,      // Ar
    padding: number,    // Pdd
    plating: number,    // Plt
    magical: number,    // Mg
    elemental: number,  // Elm
    psychic: number,    // Psy
    absorption: number, // Ab
    dampening: number,  // Dmp
    shielding: number,  // Shl
    martial: number,    // Mr
    accuracy: number,   // Acc
    evasion: number,    // Evn
    mystic: number,     // My
    potency: number,    // Ptn
    resistance: number, // Rst
    speed: number       // Spd
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
    maneuver: string,
    targetIds: string[],
    issuerId: string;
};