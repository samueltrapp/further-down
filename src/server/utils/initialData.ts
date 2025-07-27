import { GameType } from "../../types/game.ts";
import { v4 as uuidv4 } from "uuid";
import { resolveTurnOrder } from "./turnOrder.ts";
import { StatsType, TeamType } from "../../types/stats.ts";
import { CharType } from "../../types/characters.ts";

const samplePlayers: StatsType[] = [
  {
    maxHitPoints: 100,
    hitPoints: 100,
    maxSpeed: 96,
    speed: 96,
    luck: 15,
    physical: 15,
    blunt: 0,
    bladed: 0,
    armor: 2,
    padding: 0,
    plating: 0,
    magical: 10,
    elemental: 0,
    psychic: 0,
    resistance: 2,
    dampening: 0,
    warding: 0,
    martial: 50,
    accuracy: 0,
    evasion: 0,
    mystic: 50,
    control: 0,
    absorption: 0,
  },
  {
    maxHitPoints: 100,
    hitPoints: 100,
    maxSpeed: 97,
    speed: 97,
    luck: 15,
    physical: 15,
    blunt: 0,
    bladed: 0,
    armor: 2,
    padding: 0,
    plating: 0,
    magical: 10,
    elemental: 0,
    psychic: 0,
    resistance: 2,
    dampening: 0,
    warding: 0,
    martial: 50,
    accuracy: 0,
    evasion: 0,
    mystic: 50,
    control: 0,
    absorption: 0,
  },
  {
    maxHitPoints: 100,
    hitPoints: 100,
    maxSpeed: 98,
    speed: 98,
    luck: 15,
    physical: 15,
    blunt: 0,
    bladed: 0,
    armor: 2,
    padding: 0,
    plating: 0,
    magical: 10,
    elemental: 0,
    psychic: 0,
    resistance: 2,
    dampening: 0,
    warding: 0,
    martial: 50,
    accuracy: 0,
    evasion: 0,
    mystic: 50,
    control: 0,
    absorption: 0,
  },
];

const sampleEnemies: StatsType[] = [
  {
    maxHitPoints: 80,
    hitPoints: 80,
    maxSpeed: 95,
    speed: 95,
    luck: 0,
    physical: 6,
    blunt: 0,
    bladed: 0,
    armor: 10,
    padding: 0,
    plating: 0,
    magical: 10,
    elemental: 0,
    psychic: 0,
    resistance: 2,
    dampening: 0,
    warding: 0,
    martial: 50,
    accuracy: 0,
    evasion: 0,
    mystic: 50,
    control: 0,
    absorption: 0,
  },
  {
    maxHitPoints: 80,
    hitPoints: 80,
    maxSpeed: 94,
    speed: 94,
    luck: 0,
    physical: 15,
    blunt: 0,
    bladed: 0,
    armor: 5,
    padding: 0,
    plating: 0,
    magical: 10,
    elemental: 0,
    psychic: 0,
    resistance: 2,
    dampening: 0,
    warding: 0,
    martial: 50,
    accuracy: 0,
    evasion: 0,
    mystic: 50,
    control: 0,
    absorption: 0,
  },
  {
    maxHitPoints: 80,
    hitPoints: 80,
    maxSpeed: 93,
    speed: 93,
    luck: 0,
    physical: 30,
    blunt: 0,
    bladed: 0,
    armor: 0,
    padding: 0,
    plating: 0,
    magical: 10,
    elemental: 0,
    psychic: 0,
    resistance: 2,
    dampening: 0,
    warding: 0,
    martial: 50,
    accuracy: 0,
    evasion: 0,
    mystic: 50,
    control: 0,
    absorption: 0,
  },
];

const names = [
  "Guy 1",
  "Guy 2",
  "Guy 3",
  "Villain 1",
  "Villain 2",
  "Villain 3",
];

function buildStats(
  statsArray: StatsType[],
  team: TeamType,
  tieBreaker: number,
) {
  const data = [] as CharType[];
  statsArray.forEach((stats, index) => {
    const id = uuidv4();
    data.push({
      id,
      team,
      name: names[(team !== "enemy" ? 0 : 3) + index],
      stats,
      statsHistory: stats,
      lastTurn: -1 * tieBreaker,
      knownManeuvers: ["slap", "quicksilver", "fireburst", "ache"],
      knownTechniques: ["reckless", "patient", "livewire"],
      playerId: "1234",
      buffs: [],
      debuffs: [],
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
    round: 1,
    turnNumber: 1,
    turnOrder,
  };
}
