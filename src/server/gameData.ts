import { CharType, GameType, StatsType, TeamType } from "../types/game.ts";
import { v4 as uuidv4 } from 'uuid';
import { resolveTurnOrder } from "./utils";

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
        potency: 0,
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
        potency: 0,
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
        potency: 0,
        absorption: 0,
        speed: 98
    },
];

const sampleEnemies: StatsType[] = [
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
        potency: 0,
        absorption: 0,
        speed: 95
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
        potency: 0,
        absorption: 0,
        speed: 94
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
        potency: 0,
        absorption: 0,
        speed: 93
    }
];

const names = ["Guy 1", "Guy 2", "Guy 3", "Villain 1", "Villain 2", "Villain 3"];

function buildStats(statsArray: StatsType[], team: TeamType) {
    const data = [] as CharType[];
    statsArray.forEach((stats, index) => {
        const id = uuidv4();
        data.push({
            id,
            team,
            name: names[(team !== "enemy" ? 0 : 3) + index],
            stats,
            lastTurn: 0
        });
    });
    return data;
}

export function initializeGame(gameId: string): GameType {
    const players = buildStats(samplePlayers, "player");
    const enemies = buildStats(sampleEnemies, "enemy");
    const characters = players.concat(enemies);
    const turnOrder = resolveTurnOrder(characters);

    return {
        characters,
        gameId,
        turnNumber: 1,
        turnOrder
    };
}