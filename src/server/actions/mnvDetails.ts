import { ManeuverName, ManeuverType } from "../../types/maneuvers.ts";

export const maneuvers: Record<ManeuverName, ManeuverType> = {
    "slap": {
        speedCost: 12,
        actions: [
            {
                damageType: "blunt",
                strength: 0.9
            }
        ]
    },
    "quicksilver": {
        speedCost: 4,
        actions: [
            {
                damageType: "blunt",
                strength: 0.3
            },
            {
                damageType: "blunt",
                strength: 0.3
            },
            {
                damageType: "blunt",
                strength: 0.3
            },
            {
                damageType: "blunt",
                strength: 0.3
            }
        ]
    },
    "fireburst": {
        speedCost: 8,
        actions: [
            {
                damageType: "elemental",
                strength: 0.25
            },
            {
                damageType: "elemental",
                strength: 0.75
            }
        ]
    },
    "ache": {
        speedCost: 15,
        actions: [
            {
                damageType: "psychic",
                strength: 1.1
            }
        ]
    }
};