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
import { StatsType } from "../../types/individual/stats.ts";
import { blessingCollection } from "../../shared/definitions/blessings/sets.ts";
import { BlessingName } from "../../types/equipables/blessings.ts";

const baseStats: StatsType = {
  core: {
    vitality: 20,
    protection: 5,
    life: 100,
    maxLife: 100,
    initiative: 20,
    finesse: 1,
    speed: 20,
    maxSpeed: 20,
  },
  discipline: {
    martial: 5,
    mystic: 5,
    defense: 2,
    resistance: 2,
    precision: 0,
    control: 0,
    dodge: 0,
    negation: 0,
  },
  mastery: {
    bladed: 0,
    blunt: 0,
    dampening: 0,
    elemental: 0,
    padding: 0,
    plating: 0,
    psychic: 0,
    warding: 0,
  },
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
      burnSources: {},
      bleedSources: {},
      lastTurn: 0,
      equipped: {
        weapon: null,
        blessings: [],
        armor: null,
        enchantments: [],
      },
      loadout: {
        armors: [],
        blessings: [],
        enchantments: [],
        maneuvers: [],
        weapons: [],
      },
      private: {
        queue: {
          armors: randomizeCollection(playerArmorCollection) as ArmorName[],
          blessings: randomizeCollection(blessingCollection) as BlessingName[],
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
        armors: 2,
        blessings: 1,
        enchantments: 1,
        maneuvers: 1,
        weapons: 2,
        core: 0,
        discipline: 0,
        mastery: 0,
        prepare: 1,
      },
      team: "player",
      isDead: false,
    });
  }
  return initialCharacters;
};

const prefabSinglePlayer = (userId: string): Record<string, PlayerType> => ({
  "0aY7sxjZ": {
    id: "0aY7sxjZ",
    name: "Character1",
    userId: userId,
    effects: {},
    burnSources: {},
    bleedSources: {},
    lastTurn: 0,
    equipped: {
      weapon: "periapt",
      blessings: [],
      armor: "robe",
      enchantments: ["red fang"],
    },
    loadout: {
      armors: ["leather", "robe"],
      blessings: [],
      enchantments: [
        {
          name: "red fang",
          socket: "periapt",
        },
      ],
      maneuvers: ["quicksilver"],
      weapons: ["periapt", "cutlass"],
    },
    private: {
      queue: {
        armors: ["tunic", "platemail"],
        blessings: ["eternal flame"],
        enchantments: ["tall shadow", "sharpen the blade"],
        maneuvers: ["combustion", "headbutt", "deluge", "ache"],
        weapons: ["hammer", "scepter"],
      },
      savedStats: {
        core: {
          vitality: 20,
          protection: 5,
          life: 100,
          maxLife: 100,
          initiative: 20,
          finesse: 1,
          speed: 20,
          maxSpeed: 20,
        },
        discipline: {
          martial: 5,
          mystic: 5,
          defense: 2,
          resistance: 2,
          precision: 0,
          control: 0,
          dodge: 0,
          negation: 0,
        },
        mastery: {
          bladed: 0,
          blunt: 0,
          dampening: 0,
          elemental: 0,
          padding: 0,
          plating: 0,
          psychic: 0,
          warding: 0,
        },
      },
    },
    stats: {
      core: {
        vitality: 20,
        protection: 5,
        life: 100,
        maxLife: 100,
        initiative: 20,
        finesse: 1,
        speed: 20,
        maxSpeed: 20,
      },
      discipline: {
        martial: 5,
        mystic: 5,
        defense: 2,
        resistance: 2,
        precision: 0,
        control: 0,
        dodge: 0,
        negation: 0,
      },
      mastery: {
        bladed: 0,
        blunt: 0,
        dampening: 0,
        elemental: 0,
        padding: 0,
        plating: 0,
        psychic: 0,
        warding: 0,
      },
    },
    pending: {
      armors: 0,
      blessings: 0,
      enchantments: 0,
      maneuvers: 0,
      weapons: 0,
      core: 0,
      discipline: 0,
      mastery: 0,
      prepare: 0,
    },
    team: "player",
    isDead: false,
  },
  D6DzT5a8: {
    id: "D6DzT5a8",
    name: "Character2",
    userId: userId,
    effects: {},
    burnSources: {},
    bleedSources: {},
    lastTurn: 0,
    equipped: {
      weapon: "scepter",
      blessings: [],
      armor: "leather",
      enchantments: ["red fang"],
    },
    loadout: {
      armors: ["platemail", "leather"],
      blessings: [],
      enchantments: [
        {
          name: "red fang",
          socket: "scepter",
        },
      ],
      maneuvers: ["quicksilver"],
      weapons: ["scepter", "periapt"],
    },
    private: {
      queue: {
        armors: ["tunic", "robe"],
        blessings: ["eternal flame"],
        enchantments: ["sharpen the blade", "tall shadow"],
        maneuvers: ["headbutt", "pummel", "deluge", "ache"],
        weapons: ["cutlass", "hammer"],
      },
      savedStats: {
        core: {
          vitality: 20,
          protection: 5,
          life: 100,
          maxLife: 100,
          initiative: 20,
          finesse: 1,
          speed: 20,
          maxSpeed: 20,
        },
        discipline: {
          martial: 5,
          mystic: 5,
          defense: 2,
          resistance: 2,
          precision: 0,
          control: 0,
          dodge: 0,
          negation: 0,
        },
        mastery: {
          bladed: 0,
          blunt: 0,
          dampening: 0,
          elemental: 0,
          padding: 0,
          plating: 0,
          psychic: 0,
          warding: 0,
        },
      },
    },
    stats: {
      core: {
        vitality: 20,
        protection: 5,
        life: 100,
        maxLife: 100,
        initiative: 20,
        finesse: 1,
        speed: 20,
        maxSpeed: 20,
      },
      discipline: {
        martial: 5,
        mystic: 5,
        defense: 2,
        resistance: 2,
        precision: 0,
        control: 0,
        dodge: 0,
        negation: 0,
      },
      mastery: {
        bladed: 0,
        blunt: 0,
        dampening: 0,
        elemental: 0,
        padding: 0,
        plating: 0,
        psychic: 0,
        warding: 0,
      },
    },
    pending: {
      armors: 0,
      blessings: 0,
      enchantments: 0,
      maneuvers: 0,
      weapons: 0,
      core: 0,
      discipline: 0,
      mastery: 0,
      prepare: 0,
    },
    team: "player",
    isDead: false,
  },
  lKTPjmtP: {
    id: "lKTPjmtP",
    name: "Character3",
    userId: userId,
    effects: {},
    burnSources: {},
    bleedSources: {},
    lastTurn: 0,
    equipped: {
      weapon: "periapt",
      blessings: [],
      armor: "platemail",
      enchantments: [],
    },
    loadout: {
      armors: ["tunic", "platemail"],
      blessings: [],
      enchantments: [
        {
          name: "red fang",
          socket: "hammer",
        },
      ],
      maneuvers: ["headbutt"],
      weapons: ["periapt", "hammer"],
    },
    private: {
      queue: {
        armors: ["leather", "robe"],
        blessings: ["eternal flame"],
        enchantments: ["sharpen the blade", "tall shadow"],
        maneuvers: ["ache", "deluge", "quicksilver", "pummel"],
        weapons: ["scepter", "cutlass"],
      },
      savedStats: {
        core: {
          vitality: 20,
          protection: 5,
          life: 100,
          maxLife: 100,
          initiative: 20,
          finesse: 1,
          speed: 20,
          maxSpeed: 20,
        },
        discipline: {
          martial: 5,
          mystic: 5,
          defense: 2,
          resistance: 2,
          precision: 0,
          control: 0,
          dodge: 0,
          negation: 0,
        },
        mastery: {
          bladed: 0,
          blunt: 0,
          dampening: 0,
          elemental: 0,
          padding: 0,
          plating: 0,
          psychic: 0,
          warding: 0,
        },
      },
    },
    stats: {
      core: {
        vitality: 20,
        protection: 5,
        life: 100,
        maxLife: 100,
        initiative: 20,
        finesse: 1,
        speed: 20,
        maxSpeed: 20,
      },
      discipline: {
        martial: 5,
        mystic: 5,
        defense: 2,
        resistance: 2,
        precision: 0,
        control: 0,
        dodge: 0,
        negation: 0,
      },
      mastery: {
        bladed: 0,
        blunt: 0,
        dampening: 0,
        elemental: 0,
        padding: 0,
        plating: 0,
        psychic: 0,
        warding: 0,
      },
    },
    pending: {
      armors: 0,
      blessings: 0,
      enchantments: 0,
      maneuvers: 0,
      weapons: 0,
      core: 0,
      discipline: 0,
      mastery: 0,
      prepare: 0,
    },
    team: "player",
    isDead: false,
  },
});
