import { GameType, LobbyStatus } from "../../types/game.ts";
import { randomId, randomizeCollection } from "./data.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { blessingCollection } from "../lib/blessings/collection.ts";
import { armorCollection } from "../lib/armors/collection.ts";
import { maneuverCollection } from "../lib/maneuvers/collection.ts";
import { weaponCollection } from "../lib/weapons/collection.ts";
import { curseCollection } from "../lib/curses/collection.ts";
import { ArmorType } from "../../types/equipables/armors.ts";
import { BlessingType } from "../../types/equipables/blessings.ts";
import { CurseType } from "../../types/equipables/curses.ts";
import { EnchantmentType } from "../../types/equipables/enchantments.ts";
import { ManeuverType } from "../../types/equipables/maneuvers.ts";
import { WeaponType } from "../../types/equipables/weapons.ts";

const baseStats = {
  vitality: 20,
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
  speed: 20,
  currentSpeed: 20,
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
      votes: 0,
      status: LobbyStatus.WAITING,
      errorMessage: undefined,
    },
    lib: {
      blessings: blessingCollection,
      curses: curseCollection,
      maneuvers: maneuverCollection,
      weapons: weaponCollection,
      armors: armorCollection,
      enchantments: [],
    },
  };
}

export function initializeCharacters(game: GameType) {
  const users = game.lobby.users;
  const userCount = users.length;
  const userMapping = () => {
    switch (userCount) {
      case 1:
        return [users[0]]; // [users[0], users[0], users[0]]
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
      rewards: {
        owned: {
          armors: [],
          blessings: [],
          curses: [],
          enchantments: [],
          maneuvers: [],
          weapons: [],
        },
        queue: {
          armors: randomizeCollection(armorCollection) as ArmorType[],
          blessings: randomizeCollection(blessingCollection) as BlessingType[],
          curses: randomizeCollection(curseCollection) as CurseType[],
          enchantments: randomizeCollection([]) as EnchantmentType[],
          maneuvers: randomizeCollection(maneuverCollection) as ManeuverType[],
          weapons: randomizeCollection(weaponCollection) as WeaponType[],
        },
        pending: {
          armors: 1,
          blessings: 1,
          curses: 0,
          enchantments: 0,
          maneuvers: 2,
          weapons: 1,
          stats: 10,
        },
      },
      stats: baseStats,
      savedStats: baseStats,
      team: "player",
    });
  }

  return initialCharacters;
}
