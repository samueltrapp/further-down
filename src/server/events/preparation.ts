import { ConnectionType } from "../../types/server.ts";
import { SubmitPrepareType } from "../../types/events/skill.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { EnchantmentName } from "../../types/equipables/enchantments.ts";
import { LobbyStatus } from "../../types/game.ts";
import { sendGame } from "../meta/gameManagement.ts";
import { WeaponName } from "../../types/equipables/weapons.ts";
import { ArmorName } from "../../types/equipables/armors.ts";
import { BlessingName } from "../../types/equipables/blessings.ts";
import { armorMap } from "../../shared/definitions/armors/sets.ts";
import { weaponMap } from "../../shared/definitions/weapons/sets.ts";
import { enchantmentMap } from "../../shared/definitions/enchantments/sets.ts";
import { deriveArmorStats } from "../utils/stats.ts";
import { resolveTurnOrder } from "../utils/turnOrder.ts";
import { checkNextTurn } from "../battle/core.ts";

/**
 * Validates socket map keys are valid weapon/armor names
 */
function validateSocketMapKeys(
  weaponSockets: Record<string, EnchantmentName[]>,
  armorSockets: Record<string, EnchantmentName[]>,
): boolean {
  // Validate weapon keys
  for (const key of Object.keys(weaponSockets)) {
    if (!weaponMap.has(key as WeaponName)) {
      return false;
    }
  }

  // Validate armor keys
  for (const key of Object.keys(armorSockets)) {
    if (!armorMap.has(key as ArmorName)) {
      return false;
    }
  }

  return true;
}

/**
 * Validates that enchantments are in the character's loadout
 */
function validateEnchantmentsInLoadout(
  enchantmentBindings: Array<{ name: EnchantmentName }>,
  loadoutEnchantments: Array<{ name: EnchantmentName }>,
): boolean {
  const loadoutNames = new Set(loadoutEnchantments.map((e) => e.name));
  return enchantmentBindings.every((binding) => loadoutNames.has(binding.name));
}

/**
 * Validates that each enchantment's socketType matches the item it's assigned to
 */
function validateEnchantmentSocketTypes(
  weaponSockets: Record<string, EnchantmentName[]>,
  armorSockets: Record<string, EnchantmentName[]>,
): boolean {
  // Validate weapon enchantments have "weapon" socketType
  for (const enchantmentNames of Object.values(weaponSockets)) {
    for (const enchantmentName of enchantmentNames) {
      const enchantment = enchantmentMap.get(enchantmentName);
      if (!enchantment || enchantment.socketType !== "weapon") {
        return false;
      }
    }
  }

  // Validate armor enchantments have "armor" socketType
  for (const enchantmentNames of Object.values(armorSockets)) {
    for (const enchantmentName of enchantmentNames) {
      const enchantment = enchantmentMap.get(enchantmentName);
      if (!enchantment || enchantment.socketType !== "armor") {
        return false;
      }
    }
  }

  return true;
}

/**
 * Validates that no item exceeds its socketSize capacity
 */
function validateSocketCapacity(
  weaponSockets: Record<string, EnchantmentName[]>,
  armorSockets: Record<string, EnchantmentName[]>,
): boolean {
  // Check weapon sockets
  for (const [weaponName, enchantmentNames] of Object.entries(weaponSockets)) {
    const weapon = weaponMap.get(weaponName as WeaponName);
    if (!weapon || enchantmentNames.length > weapon.socketSize) {
      return false;
    }
  }

  // Check armor sockets
  for (const [armorName, enchantmentNames] of Object.entries(armorSockets)) {
    const armor = armorMap.get(armorName as ArmorName);
    if (!armor || enchantmentNames.length > armor.socketSize) {
      return false;
    }
  }

  return true;
}

export function submitPrepare(
  connection: ConnectionType,
  {
    gameId,
    characterId,
    weaponSockets,
    armorSockets,
    weapon,
    armor,
    blessings,
  }: SubmitPrepareType,
) {
  const game = connection.meta.games.get(gameId);
  if (!game?.characters) return;

  const character = { ...game.characters[characterId] } as PlayerType;
  const userId = connection.socket.data.userId;

  // Validate preparation submission
  if (
    character?.team !== "player" ||
    game.lobby.status !== LobbyStatus.PREPARE ||
    character.pending.prepare <= 0 ||
    character.userId !== userId
  ) {
    connection.socket.emit("error", { message: "Invalid preparation" });
    return;
  }

  // Validate socket assignments before trusting enchantment names
  if (
    !validateSocketMapKeys(weaponSockets, armorSockets) ||
    !validateEnchantmentSocketTypes(weaponSockets, armorSockets) ||
    !validateSocketCapacity(weaponSockets, armorSockets)
  ) {
    connection.socket.emit("error", { message: "Invalid socket assignments" });
    return;
  }

  // Flatten enchantments from socket maps and validate they're in the character's loadout
  const allSocketedEnchantments = [
    ...Object.values(weaponSockets).flat(),
    ...Object.values(armorSockets).flat(),
  ];

  if (
    !validateEnchantmentsInLoadout(
      allSocketedEnchantments.map((name) => ({ name })),
      character.loadout.enchantments,
    )
  ) {
    connection.socket.emit("error", {
      message: "Enchantments not in loadout",
    });
    return;
  }

  /* Guard against a client sending more than the allowed cap or blessings outside the loadout.
     Consume matching entries from a copy to ensure each equipped copy is owned. */
  const remainingBlessings = [...character.loadout.blessings];
  const validBlessings: BlessingName[] = [];
  for (const name of blessings) {
    const index = remainingBlessings.indexOf(name);
    if (index !== -1) {
      remainingBlessings.splice(index, 1);
      validBlessings.push(name);
      if (validBlessings.length >= 3) break;
    }
  }

  /* Consume copies of the socket maps to correctly handle duplicate enchantment names. */
  const remainingWeapon: Record<string, EnchantmentName[]> = Object.fromEntries(
    Object.entries(weaponSockets).map(([key, names]) => [
      key,
      [...(names ?? [])],
    ]),
  );
  const remainingArmor: Record<string, EnchantmentName[]> = Object.fromEntries(
    Object.entries(armorSockets).map(([key, names]) => [
      key,
      [...(names ?? [])],
    ]),
  );

  const updatedEnchantments = character.loadout.enchantments.map((binding) => {
    for (const [weaponName, names] of Object.entries(remainingWeapon)) {
      const index = names.indexOf(binding.name);
      if (index !== -1) {
        names.splice(index, 1);
        return { ...binding, socket: weaponName as WeaponName };
      }
    }
    for (const [armorName, names] of Object.entries(remainingArmor)) {
      const index = names.indexOf(binding.name);
      if (index !== -1) {
        names.splice(index, 1);
        return { ...binding, socket: armorName as ArmorName };
      }
    }
    return { ...binding, socket: null };
  });

  character.loadout.enchantments = updatedEnchantments;
  character.equipped = {
    weapon,
    armor,
    blessings: validBlessings,
    /* Collect enchantments whose socket matches either equipped item. */
    enchantments: updatedEnchantments
      .filter(
        (binding) => binding.socket === weapon || binding.socket === armor,
      )
      .map((binding) => binding.name),
  };
  character.stats = deriveArmorStats(
    character.stats,
    armor ? (armorMap.get(armor) ?? null) : null,
  );
  character.pending.prepare = 0;

  game.characters[characterId] = character;

  /* Equipping armor can change a character's speed, so the turn order
     needs to be recalculated to reflect it, especially before the first
     turn of the battle is taken. */
  if (game.battle) {
    game.battle.turnOrder = resolveTurnOrder(game.characters);
  }

  const finished = Object.values(game.characters).every(
    (char) =>
      char.team !== "player" || (char as PlayerType).pending.prepare === 0,
  );

  if (finished) {
    game.lobby.status = LobbyStatus.BATTLE;
  }

  connection.meta.games.set(gameId, game);
  sendGame(connection, gameId);

  /* Now that every player has locked in their equipment (and turn order
     reflects final speed stats), take an enemy's first turn if applicable. */
  if (finished && game.battle?.isFresh) {
    checkNextTurn(connection, gameId, 5000);
  }
}
