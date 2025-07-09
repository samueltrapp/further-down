import { CharType, GameType, StatsType, TeamType } from "../../types/game.ts";
import { v4 as uuidv4 } from 'uuid';
import { resolveTurnOrder } from "./turnOrder.ts";

const samplePlayers: StatsType[] = [
    {
        hitPoints: 100,
        physical: 15,
        blunt: 0,
        sharp: 0,
        armor: 2,
        padding: 0,
        plating: 0,
        magical: 10,
        elemental: 0,
        psychic: 0,
        resistance: 2,
        dampening: 0,
        shielding: 0,
        martial: 50,
        accuracy: 0,
        evasion: 0,
        mystic: 50,
        discipline: 0,
        absorption: 0,
        speed: 96
    },
    {
        hitPoints: 100,
        physical: 15,
        blunt: 0,
        sharp: 0,
        armor: 2,
        padding: 0,
        plating: 0,
        magical: 10,
        elemental: 0,
        psychic: 0,
        resistance: 2,
        dampening: 0,
        shielding: 0,
        martial: 50,
        accuracy: 0,
        evasion: 0,
        mystic: 50,
        discipline: 0,
        absorption: 0,
        speed: 97
    },
    {
        hitPoints: 100,
        physical: 15,
        blunt: 0,
        sharp: 0,
        armor: 2,
        padding: 0,
        plating: 0,
        magical: 10,
        elemental: 0,
        psychic: 0,
        resistance: 2,
        dampening: 0,
        shielding: 0,
        martial: 50,
        accuracy: 0,
        evasion: 0,
        mystic: 50,
        discipline: 0,
        absorption: 0,
        speed: 98
    },
];

const sampleEnemies: StatsType[] = [
    {
        hitPoints: 80,
        physical: 6,
        blunt: 0,
        sharp: 0,
        armor: 10,
        padding: 0,
        plating: 0,
        magical: 10,
        elemental: 0,
        psychic: 0,
        resistance: 2,
        dampening: 0,
        shielding: 0,
        martial: 50,
        accuracy: 0,
        evasion: 0,
        mystic: 50,
        discipline: 0,
        absorption: 0,
        speed: 95
    },
    {
        hitPoints: 80,
        physical: 15,
        blunt: 0,
        sharp: 0,
        armor: 5,
        padding: 0,
        plating: 0,
        magical: 10,
        elemental: 0,
        psychic: 0,
        resistance: 2,
        dampening: 0,
        shielding: 0,
        martial: 50,
        accuracy: 0,
        evasion: 0,
        mystic: 50,
        discipline: 0,
        absorption: 0,
        speed: 94
    },
    {
        hitPoints: 80,
        physical: 30,
        blunt: 0,
        sharp: 0,
        armor: 0,
        padding: 0,
        plating: 0,
        magical: 10,
        elemental: 0,
        psychic: 0,
        resistance: 2,
        dampening: 0,
        shielding: 0,
        martial: 50,
        accuracy: 0,
        evasion: 0,
        mystic: 50,
        discipline: 0,
        absorption: 0,
        speed: 93
    }
];

const names = ["Guy 1", "Guy 2", "Guy 3", "Villain 1", "Villain 2", "Villain 3"];

function buildStats(statsArray: StatsType[], team: TeamType, tieBreaker: number) {
    const data = [] as CharType[];
    statsArray.forEach((stats, index) => {
        const id = uuidv4();
        data.push({
            id,
            team,
            name: names[(team !== "enemy" ? 0 : 3) + index],
            stats,
            lastTurn: -1 * tieBreaker
        });
    });
    return data;
}

export function initializeGame(gameId: string): GameType {
    const characterCount = 6;
    const tieBreaker: number[] = [];
    for (let i = 1; i <= characterCount; i++) {
        tieBreaker.push(i);
    }
    const pullRandomSeed = () =>
        tieBreaker.splice(Math.round(Math.random() * characterCount), 1)[0];

    const players = buildStats(samplePlayers, "player", pullRandomSeed());
    const enemies = buildStats(sampleEnemies, "enemy", pullRandomSeed());
    const characters = players.concat(enemies);
    const turnOrder = resolveTurnOrder(characters);

    return {
        characters,
        gameId,
        turnNumber: 1,
        turnOrder
    };
}