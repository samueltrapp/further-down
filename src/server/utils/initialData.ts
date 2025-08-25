import { GameType, LobbyStatus } from "../../types/game.ts";
import { randomId } from "./data.ts";
import { PlayerType } from "../../types/individual/characters.ts";

const baseStats = {
  vitality: 20,
  bladed: 0,
  blunt: 0,
  currentHitPoints: 100,
  dampening: 0,
  defense: 0,
  elemental: 0,
  hitPoints: 100,
  magical: 0,
  padding: 0,
  physical: 0,
  plating: 0,
  psychic: 0,
  resistance: 0,
  speed: 20,
  speedCapacity: 20,
  warding: 0,
};

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
      users: [userId],
      startVotes: 0,
      status: LobbyStatus.WAITING,
      errorMessage: undefined,
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

export function initializeCharacters(game: GameType) {
  const users = game.lobby.users;
  const userCount = users.length;
  const userMapping = () => {
    switch (userCount) {
      case 1:
        return [users[0], users[0], users[0]];
      case 2:
        return [users[0], users[0], users[1], users[1]];
      case 3:
        return [users[0], users[1], users[2]];
      case 4:
        return [users[0], users[1], users[2], users[3]];
      default:
        return [];
    }
  };
  const userSpread = userMapping();

  const initialCharacters: PlayerType[] = [];
  for (const user of userSpread) {
    initialCharacters.push({
      id: randomId(8),
      name: "",
      userId: user,
      effects: {
        burdens: [],
        favors: [],
        lastTurn: 0,
      },
      pendingRewards: {
        armors: 1,
        blessings: 1,
        curses: 0,
        enchantments: 0,
        maneuvers: 2,
        weapons: 1,
      },
      rewards: {
        armors: [],
        blessings: [],
        curses: [],
        enchantments: [],
        maneuvers: [],
        weapons: [],
      },
      stats: baseStats,
      savedStats: baseStats,
      team: "player",
    });
  }

  return initialCharacters;
}
