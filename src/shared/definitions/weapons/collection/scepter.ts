import {WeaponType} from "../../../../types/equipables/weapons.ts";

export const scepter: WeaponType = {
    name: "scepter",
    power: 3,
    spread: 0,
    affinities: {
        physical: 1.1,
        magical: 1.9,
        bladed: 0,
        blunt: 1.5,
        elemental: 1.9,
        psychic: 1.4,
    },
    level: 1,
    rarity: 0,
    equipped: false,
    description: "Scepter description",
};