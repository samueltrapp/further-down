import { CharacterDataType, StatsType, UniqueStatsType } from "../types";
import { v4 as uuidv4 } from 'uuid';

export const samplePlayers = [
    {
        name: "Guy 1",
        hitPoints: 100,
        physical: 15,
        speed: 95
    },
    {
        name: "Guy 2",
        hitPoints: 85,
        physical: 24,
        speed: 80
    },
    {
        name: "Guy 3",
        hitPoints: 85,
        physical: 24,
        speed: 90
    },
];


function generateEnemies(): StatsType[] {
    return [
        {
            name: "Villain 1",
            hitPoints: 500,
            physical: 12,
            speed: 70
        },
        {
            name: "Villain 2",
            hitPoints: 400,
            physical: 14,
            speed: 82
        }
    ];
}

function buildStats(statsArray: StatsType[]) {
    const data = {};
    statsArray.forEach((stat) => {
        const id = uuidv4();
        Object.assign(data, { [id]: stat});
    });
    return data as UniqueStatsType;
}

export function initializeGame(players: StatsType[]): CharacterDataType {
    const playerData = buildStats(players);

    const enemies = generateEnemies();
    const enemyData = buildStats(enemies);
    
    return {
        players: playerData,
        enemies: enemyData
    };
};