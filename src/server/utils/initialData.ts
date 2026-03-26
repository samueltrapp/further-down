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
      effects: {
        burdens: {},
        favors: {},
      },
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
        stats: 0,
      },
      team: "player",
      isDead: false,
    });
  }
  return initialCharacters;
};

const prefabSinglePlayer = (userId: string): Record<string, PlayerType> => ({
  XVGbnfui: {
    id: "XVGbnfui",
    name: "Alvin",
    userId: userId,
    effects: {
      burdens: {},
      favors: {},
    },
    lastTurn: 0,
    equipped: {
      armor: "platemail",
      weapon: "hammer",
      enchantments: [],
    },
    loadout: {
      armors: ["platemail"],
      enchantments: [],
      maneuvers: ["quicksilver"],
      weapons: ["hammer", "scepter"],
    },
    private: {
      queue: {
        armors: ["leather", "robe", "tunic"],
        enchantments: [],
        maneuvers: [],
        weapons: ["cutlass", "periapt"],
      },
      savedStats: {
        life: 100,
        maxLife: 100,
        vitality: 20,
        speed: 21,
        maxSpeed: 21,
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
    pending: {
      armors: 0,
      enchantments: 0,
      maneuvers: 0,
      weapons: 0,
      stats: 0,
    },
    stats: {
      life: 100,
      maxLife: 100,
      vitality: 20,
      speed: 21,
      maxSpeed: 21,
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
    team: "player",
    isDead: false,
  },
  "3b9hsrxl": {
    id: "3b9hsrxl",
    name: "Berenice",
    userId: userId,
    effects: {
      burdens: {},
      favors: {},
    },
    lastTurn: 0,
    equipped: {
      armor: "tunic",
      weapon: "hammer",
      enchantments: [],
    },
    loadout: {
      armors: ["tunic"],
      enchantments: [],
      maneuvers: ["quicksilver"],
      weapons: ["hammer", "periapt"],
    },
    private: {
      queue: {
        armors: ["leather", "robe", "platemail"],
        enchantments: [],
        maneuvers: [],
        weapons: ["cutlass", "scepter"],
      },
      savedStats: {
        life: 100,
        maxLife: 100,
        vitality: 20,
        speed: 21,
        maxSpeed: 21,
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
    pending: {
      armors: 0,
      enchantments: 0,
      maneuvers: 0,
      weapons: 0,
      stats: 0,
    },
    stats: {
      life: 100,
      maxLife: 100,
      vitality: 20,
      speed: 21,
      maxSpeed: 21,
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
    team: "player",
    isDead: false,
  },
  ymukbWJk: {
    id: "ymukbWJk",
    name: "Charlie",
    userId: userId,
    effects: {
      burdens: {},
      favors: {},
    },
    lastTurn: 0,
    equipped: {
      armor: "tunic",
      weapon: "cutlass",
      enchantments: [],
    },
    loadout: {
      armors: ["robe"],
      enchantments: [],
      maneuvers: ["quicksilver"],
      weapons: ["cutlass", "hammer"],
    },
    private: {
      queue: {
        armors: ["tunic", "platemail", "leather"],
        enchantments: [],
        maneuvers: [],
        weapons: ["scepter", "periapt"],
      },
      savedStats: {
        life: 100,
        maxLife: 100,
        vitality: 20,
        speed: 21,
        maxSpeed: 21,
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
    pending: {
      armors: 0,
      enchantments: 0,
      maneuvers: 0,
      weapons: 0,
      stats: 0,
    },
    stats: {
      life: 100,
      maxLife: 100,
      vitality: 20,
      speed: 21,
      maxSpeed: 21,
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
    team: "player",
    isDead: false,
  },
});
