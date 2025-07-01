import { CharType, GameType, StatsType, TeamType } from "../types";
import { v4 as uuidv4 } from 'uuid';

const samplePlayers: StatsType[] = [
    {
        name: "Guy 1",
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
        name: "Guy 2",
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
        name: "Guy 3",
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
        name: "Villain 1",
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
        name: "Villain 2",
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
    }
];

function buildStats(statsArray: StatsType[], team: TeamType) {
    const data = [] as CharType[];
    statsArray.forEach((stats) => {
        const id = uuidv4();
        data.push({ id, team, stats });
    });
    return data;
}

export function initializeGame(gameId: string): GameType {
    const players = buildStats(samplePlayers, "player");
    const enemies = buildStats(sampleEnemies, "enemy");
    const characters = players.concat(enemies);

    return {
        gameId: gameId,
        characters
    };
}