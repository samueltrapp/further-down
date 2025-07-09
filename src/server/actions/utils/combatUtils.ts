import { DamageType } from "../../../types/maneuvers.ts";
import {CharType, StatsType} from "../../../types/game.ts";

export const findCharacter = (characters: CharType[], charId: string): [CharType, number] => {
    const attackerId = characters.findIndex((character) => character.id === charId);
    const attacker = characters[attackerId];
    return [attacker, attackerId];
};

export const calcRawDamage = (stats: StatsType, damageType: DamageType) => {
    switch (damageType) {
        case "blunt":
            return stats.physical + stats.blunt;
        case "sharp":
            return stats.physical + stats.sharp;
        case "elemental":
            return stats.magical + stats.elemental;
        case "psychic":
            return stats.magical + stats.psychic;
        default:
            return 0;
    }
};

export const calcRawMitigation = (stats: StatsType, damageType: DamageType) => {
    switch (damageType) {
        case "blunt":
            return stats.armor + stats.plating;
        case "sharp":
            return stats.armor + stats.padding;
        case "elemental":
            return stats.resistance + stats.dampening;
        case "psychic":
            return stats.resistance + stats.shielding;
        default:
            return 0;
    }
}

export const limitToZero = (value: number) => Math.max(value, 0);
export const truncate = (value: number) => Math.trunc(value);