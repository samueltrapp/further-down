import { ManeuverType } from "../../../../types/equipables/actions.ts";

export const quicksilver: ManeuverType = {
    name: "quicksilver",
    description: "Quicksilver description",
    speedCost: 4,
    maxTargets: 1,
    accuracy: 90,
    steps: [
        {
            type: "hit",
            damageType: "blunt",
            strength: 0.3,
        },
        {
            type: "hit",
            damageType: "blunt",
            strength: 0.3,
        },
        {
            type: "hit",
            damageType: "blunt",
            strength: 0.3,
        },
        {
            type: "hit",
            damageType: "blunt",
            strength: 0.3,
        },
    ],
    tags: ["attack", "multi", "pure", "bladed"],
};