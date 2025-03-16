export enum TurnActions {
    ATTACK = "ATTACK",
    HEAL = "HEAL"
}

export type StatsType = {
    name: string,
    hitPoints: number,
    physical: number,
    speed: number
}

export type CombatStats = {
    attacker: StatsType,
    targets: StatsType[]
}

export type UniqueStatsType = {
    id: string;
    stats: StatsType;
};

export type GuaranteedCharacterDataType = {
    players: UniqueStatsType[],
    enemies: UniqueStatsType[]
}

export type CharacterDataType = GuaranteedCharacterDataType | null

export type TurnType = {
    action: TurnActions,
    issuerId: string,
    targetIds: string[];
}