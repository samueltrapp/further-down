export type TeamType = "player" | "enemy";

export type StatName =
    | "life"
    | "maxLife"
    | "vitality"
    | "speed"
    | "maxSpeed"
    | "physical"
    | "defense"
    | "magical"
    | "resistance"
    | "bladed"
    | "blunt"
    | "elemental"
    | "psychic"
    | "plating"
    | "padding"
    | "dampening"
    | "warding"
    | "evasion"
    | "accuracy";

export type StatsType = Record<StatName, number>;
