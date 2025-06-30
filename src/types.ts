export enum GameActions {
    ATTACK = "ATTACK",
    SELECT = "SELECT",
    SYNC = "SYNC"
}

export enum TurnActions {
    ATTACK = "ATTACK",
    HEAL = "HEAL"
}

export type TeamType = "player" | "enemy";

export type StatsType = {
    name: string, 
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
    team: TeamType; 
    stats: StatsType;
};

export type GameType = {
    gameId: string,
    gameState: {
        characters: CharType[]
    },
};

export type GameMetaType = {
    games: GameType[],
    findGame: (gameId: string) => GameType | undefined
};

export type TurnType = {
    action: TurnActions,
    issuerId: string,
    targetIds: string[];
};