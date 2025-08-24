import { GameType, LobbyStatus } from "../../types/game.ts";

//   maxHitPoints: 100,
//   hitPoints: 100,
//   maxSpeed: 96,
//   speed: 96,
//   physical: 15,
//   blunt: 0,
//   bladed: 0,
//   defense: 2,
//   padding: 0,
//   plating: 0,
//   magical: 10,
//   elemental: 0,
//   psychic: 0,
//   resistance: 2,
//   dampening: 0,
//   warding: 0,
//   martial: 50,
//   accuracy: 0,
//   evasion: 0,
//   mystic: 50,
//   control: 0,
//   absorption: 0,

// function buildStats(
//   statsArray: StatsType[],
//   team: TeamType,
//   tieBreaker: number,
// ) {
//   const data = [] as CharType[];
//   statsArray.forEach((stats, index) => {
//     const id = randomId(8);
//     data.push({
//       id,
//       team,
//       name: names[(team !== "enemy" ? 0 : 3) + index],
//       stats,
//       statsHistory: stats,
//       lastTurn: -1 * tieBreaker,
//       knownManeuvers: ["slap", "quicksilver", "fireburst", "ache"],
//       ownedWeapons: [
//         {
//           name: "sword",
//           equipped: true,
//           power: 6,
//           spread: 2,
//           affinities: {
//             physical: 1.5,
//             magical: 1,
//             bladed: 2,
//             blunt: 1,
//             elemental: 1.2,
//             psychic: 0,
//           },
//           level: 1,
//           rarity: 0,
//         },
//         {
//           name: "bow",
//           equipped: false,
//           power: 5,
//           spread: 4,
//           affinities: {
//             physical: 1.8,
//             magical: 0.6,
//             bladed: 1.8,
//             blunt: 1.2,
//             elemental: 1.5,
//             psychic: 0.8,
//           },
//           level: 1,
//           rarity: 0,
//         },
//       ],
//       userId: "1234",
//       favors: [],
//       burdens: [],
//     });
//   });
//   return data;

// export function initializeGame(gameId: string, userId: string): GameType {
//   const characterCount = 6;
//   const tieBreaker: number[] = [];
//   for (let i = 1; i <= characterCount; i++) {
//     tieBreaker.push(i);
//   }
//
//   const pullRandomSeed = () =>
//     tieBreaker.splice(Math.round(Math.random() * characterCount), 1)[0];
//
//   const players = buildStats(samplePlayers, "player", pullRandomSeed());
//   const enemies = buildStats(sampleEnemies, "enemy", pullRandomSeed());
//   const characters = players.concat(enemies);
//   const turnOrder = resolveTurnOrder(characters);
//
//   return {
//     characters,
//     gameId,
//     lobbyStatus: "waiting",
//     players: [],
//     round: 1,
//     turnNumber: 1,
//     turnOrder,
//   };
// }

export function initializeLobby(gameId: string, userId: string): GameType {
  return {
    battle: undefined,
    characters: {
      enemies: [],
      players: [],
    },
    lobby: {
      gameId: gameId,
      pastEncounters: 0,
      players: [userId],
      startVotes: 0,
      status: LobbyStatus.WAITING,
      errorMsg: undefined,
    },
    lib: {
      blessings: ["angelblade", "flow", "pacifist", "predation"],
      curses: ["weak"],
      maneuvers: ["ache", "slap", "fireburst", "quicksilver"],
      weapons: ["cutlass", "hammer", "periapt", "scepter"],
      armors: ["leather", "platemail", "robe", "tunic"],
      enchantments: ["lethal", "silver"],
    },
  };
}
