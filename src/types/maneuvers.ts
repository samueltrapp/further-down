import {StatsType} from "./game.ts";

export type ManeuverName =
    "slap" |
    "quicksilver" |
    "fireburst" |
    "ache";

type AttackType = {
    damage: number,
    damageType: DamageType
}

export type DamageType = "blunt" | "sharp" | "elemental" | "psychic";
export type OtherManeuverFnType = (stats: StatsType, influence: AttackType) => StatsType;
export type SelfManeuverFnType = (stats: StatsType, details: number) => StatsType;
export type ManeuverType = {
    speedCost: number;
    actions: {
        damageType: DamageType,
        strength: number
    }[]
};
