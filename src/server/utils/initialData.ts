import { GameType, LobbyStatus } from "../../types/game.ts";
import { randomId, randomizeCollection } from "./character.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { armorCollection } from "../../shared/definitions/armors/sets.ts";
import { enchantmentCollection } from "../../shared/definitions/enchantments/sets.ts";
import { maneuverCollection } from "../../shared/definitions/maneuvers/sets.ts";
import { weaponCollection } from "../../shared/definitions/weapons/sets.ts";
import { ArmorName } from "../../types/equipables/armors.ts";
import { EnchantmentName } from "../../types/equipables/enchantments.ts";
import { ManeuverName } from "../../types/equipables/actions.ts";
import { WeaponName } from "../../types/equipables/weapons.ts";

const baseStats = {
  life: 100,
  maxLife: 100,
  vitality: 20,
  speed: 21,
  maxSpeed: 21,
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
    characters: new Map(),
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

  const initialCharacters: Map<string, PlayerType> = new Map();
  for (const user of userSpread) {
    const id = randomId(8);
    const blankCharacter: PlayerType = structuredClone({
      id,
      name: "",
      userId: user,
      effects: {
        burdens: {},
        favors: {},
      },
      lastTurn: 0,
      rewards: {
        equippedArmor: null,
        equippedWeapon: null,
        owned: {
          armors: [],
          enchantments: [],
          maneuvers: [],
          weapons: [],
        },
        queue: {
          armors: randomizeCollection(armorCollection) as ArmorName[],
          enchantments: randomizeCollection(
            enchantmentCollection,
          ) as EnchantmentName[],
          maneuvers: randomizeCollection(maneuverCollection) as ManeuverName[],
          weapons: randomizeCollection(weaponCollection) as WeaponName[],
        },
        pending: {
          armors: 1,
          enchantments: 0,
          maneuvers: 1,
          weapons: 1,
          stats: 0,
        },
      },
      stats: baseStats,
      savedStats: baseStats,
      team: "player",
    });

    initialCharacters.set(id, blankCharacter);
  }

  return initialCharacters;
}
