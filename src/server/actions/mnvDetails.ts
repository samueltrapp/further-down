import { ManeuverName, ManeuverType } from "../../types/maneuvers.ts";

export const maneuvers: Record<ManeuverName, ManeuverType> = {
    "slap": {
        speedCost: 12,
        maxTargets: 1,
        actions: [
            {
                damageType: "blunt",
                strength: 0.9
            }
        ]
    },
    "quicksilver": {
        speedCost: 4,
        maxTargets: 1,
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
        maxTargets: 3,
        actions: [
            {
                damageType: "elemental",
                strength: 0.15
            },
            {
                damageType: "elemental",
                strength: 0.50
            }
        ]
    },
    "ache": {
        speedCost: 15,
        maxTargets: 1,
        actions: [
            {
                damageType: "psychic",
                strength: 1.1
            }
        ]
    }
};