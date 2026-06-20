import { GameType, LobbyStatus } from "../../types/game.ts";
import { randomId, randomizeCollection } from "./character.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { playerArmorCollection } from "../../shared/definitions/armors/sets.ts";
import { enchantmentCollection } from "../../shared/definitions/enchantments/sets.ts";
import { maneuverCollection } from "../../shared/definitions/maneuvers/sets.ts";
import { weaponCollection } from "../../shared/definitions/weapons/sets.ts";
import { ArmorName } from "../../types/equipables/armors.ts";
import { EnchantmentName } from "../../types/equipables/enchantments.ts";
import { ManeuverName } from "../../types/equipables/maneuvers.ts";
import { WeaponName } from "../../types/equipables/weapons.ts";

const baseStats = {
  life: 100,
  maxLife: 100,
  vitality: 20,
  speed: 20,
  maxSpeed: 20,
  bladed: 0,
  blunt: 0,
  currentHitPoints: 100,
  dampening: 0,
  defense: 0,
  elemental: 0,
  hitPoints: 100,
  magical: 5,
  padding: 0,
  physical: 5,
  plating: 0,
  psychic: 0,
  resistance: 0,
  warding: 0,
  evasion: 0,
  accuracy: 0,
};

export function initializeLobby(gameId: string, userId: string): GameType {
  return {
    battle: null,
    characters: null,
    lobby: {
      gameId: gameId,
      pastEncounters: 0,
      users: [userId],
      votes: [],
      status: LobbyStatus.WAITING,
      errorMessage: "",
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

  return process.env.MOCK_SINGLE_PLAYER === "true"
    ? prefabSinglePlayer(users[0])
    : blankCharacters(userSpread);
}

const blankCharacters = (userSpread: string[]) => {
  const initialCharacters: Record<string, PlayerType> = {};
  for (const user of userSpread) {
    const id = randomId(8);
    initialCharacters[id] = structuredClone({
      id,
      name: "",
      userId: user,
      effects: {},
      lastTurn: 0,
      equipped: {
        weapon: null,
        armor: null,
        enchantments: [],
      },
      loadout: {
        armors: [],
        enchantments: [],
        maneuvers: [],
        weapons: [],
      },
      private: {
        queue: {
          armors: randomizeCollection(playerArmorCollection) as ArmorName[],
          enchantments: randomizeCollection(
            enchantmentCollection,
          ) as EnchantmentName[],
          maneuvers: randomizeCollection(maneuverCollection) as ManeuverName[],
          weapons: randomizeCollection(weaponCollection) as WeaponName[],
        },
        savedStats: baseStats,
      },
      stats: baseStats,
      pending: {
        armors: 1,
        enchantments: 0,
        maneuvers: 1,
        weapons: 2,
        stats: 20,
      },
      team: "player",
      isDead: false,
    });
  }
  return initialCharacters;
};

const prefabSinglePlayer = (userId: string): Record<string, PlayerType> => ({
  aQNgmuOa: {
    id: "aQNgmuOa",
    name: "Player",
    userId: userId,
    effects: {},
    lastTurn: 0,
    equipped: {
      weapon: "cutlass",
      armor: "leather",
      enchantments: ["sharpen the blade", "red fang"],
    },
    loadout: {
      armors: ["leather"],
      enchantments: ["red fang"],
      maneuvers: ["quicksilver"],
      weapons: ["cutlass", "scepter"],
    },
    private: {
      queue: {
        armors: ["robe", "tunic", "platemail"],
        enchantments: [],
        maneuvers: ["ache", "deluge", "pummel"],
        weapons: ["hammer", "periapt"],
      },
      savedStats: {
        life: 100,
        maxLife: 100,
        vitality: 20,
        speed: 20,
        maxSpeed: 20,
        bladed: 0,
        blunt: 0,
        dampening: 0,
        defense: 0,
        elemental: 0,
        magical: 5,
        padding: 0,
        physical: 5,
        plating: 0,
        psychic: 0,
        resistance: 0,
        warding: 0,
        evasion: 0,
        accuracy: 0,
      },
    },
    stats: {
      life: 100,
      maxLife: 100,
      vitality: 20,
      speed: 23,
      maxSpeed: 20,
      bladed: 7,
      blunt: 0,
      dampening: 0,
      defense: 3,
      elemental: 0,
      magical: 7,
      padding: 0,
      physical: 8,
      plating: 0,
      psychic: 0,
      resistance: 2,
      warding: 0,
      evasion: 0,
      accuracy: 0,
    },
    pending: {
      armors: 0,
      enchantments: 0,
      maneuvers: 0,
      weapons: 0,
      stats: 0,
    },
    team: "player",
    isDead: false,
  },
  sfmVNDFl: {
    id: "sfmVNDFl",
    name: "Player2",
    userId: userId,
    effects: {},
    lastTurn: 0,
    equipped: {
      weapon: "periapt",
      armor: "robe",
      enchantments: [],
    },
    loadout: {
      armors: ["robe"],
      enchantments: [],
      maneuvers: ["ache"],
      weapons: ["periapt", "scepter"],
    },
    private: {
      queue: {
        armors: ["tunic", "platemail", "leather"],
        enchantments: [],
        maneuvers: ["deluge", "pummel", "quicksilver"],
        weapons: ["hammer", "cutlass"],
      },
      savedStats: {
        life: 100,
        maxLife: 100,
        vitality: 20,
        speed: 20,
        maxSpeed: 20,
        bladed: 0,
        blunt: 0,
        dampening: 0,
        defense: 0,
        elemental: 0,
        magical: 5,
        padding: 0,
        physical: 5,
        plating: 0,
        psychic: 0,
        resistance: 0,
        warding: 0,
        evasion: 0,
        accuracy: 0,
      },
    },
    stats: {
      life: 100,
      maxLife: 100,
      vitality: 20,
      speed: 22,
      maxSpeed: 20,
      bladed: 0,
      blunt: 0,
      dampening: 1,
      defense: 1,
      elemental: 0,
      magical: 10,
      padding: 0,
      physical: 5,
      plating: 1,
      psychic: 7,
      resistance: 2,
      warding: 1,
      evasion: 0,
      accuracy: 0,
    },
    pending: {
      armors: 0,
      enchantments: 0,
      maneuvers: 0,
      weapons: 0,
      stats: 0,
    },
    team: "player",
    isDead: false,
  },
  IeHCHSPR: {
    id: "IeHCHSPR",
    name: "Player3",
    userId: userId,
    effects: {},
    lastTurn: 0,
    equipped: {
      weapon: "hammer",
      armor: "platemail",
      enchantments: [],
    },
    loadout: {
      armors: ["platemail"],
      enchantments: [],
      maneuvers: ["pummel"],
      weapons: ["hammer", "scepter"],
    },
    private: {
      queue: {
        armors: ["tunic", "leather", "robe"],
        enchantments: [],
        maneuvers: ["ache", "quicksilver", "deluge"],
        weapons: ["periapt", "cutlass"],
      },
      savedStats: {
        life: 100,
        maxLife: 100,
        vitality: 20,
        speed: 20,
        maxSpeed: 20,
        bladed: 0,
        blunt: 0,
        dampening: 0,
        defense: 0,
        elemental: 0,
        magical: 5,
        padding: 0,
        physical: 5,
        plating: 0,
        psychic: 0,
        resistance: 0,
        warding: 0,
        evasion: 0,
        accuracy: 0,
      },
    },
    stats: {
      life: 100,
      maxLife: 100,
      vitality: 20,
      speed: 21,
      maxSpeed: 20,
      bladed: 0,
      blunt: 12,
      dampening: 0,
      defense: 1,
      elemental: 0,
      magical: 5,
      padding: 0,
      physical: 10,
      plating: 0,
      psychic: 0,
      resistance: 1,
      warding: 0,
      evasion: 0,
      accuracy: 0,
    },
    pending: {
      armors: 0,
      enchantments: 0,
      maneuvers: 0,
      weapons: 0,
      stats: 0,
    },
    team: "player",
    isDead: false,
  },
});
