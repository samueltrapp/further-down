import { ConnectionType } from "../../types/server.ts";
import { SubmitPrepareType } from "../../types/events/skill.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { EnchantmentName } from "../../types/equipables/enchantments.ts";
import { LobbyStatus } from "../../types/game.ts";
import { sendGame } from "../meta/gameManagement.ts";
import { WeaponName } from "../../types/equipables/weapons.ts";
import { ArmorName } from "../../types/equipables/armors.ts";

export function submitPrepare(
  connection: ConnectionType,
  {
    gameId,
    characterId,
    weaponSockets,
    armorSockets,
    weapon,
    armor,
  }: SubmitPrepareType,
) {
  const game = connection.meta.games.get(gameId);
  if (game?.characters) {
    const character = { ...game.characters[characterId] } as PlayerType;
    if (character?.team !== "player") return;

    /* Consume copies of the socket maps to correctly handle duplicate enchantment names. */
    const remainingWeapon: Record<string, EnchantmentName[]> =
      Object.fromEntries(
        Object.entries(weaponSockets).map(([key, names]) => [
          key,
          [...(names ?? [])],
        ]),
      );
    const remainingArmor: Record<string, EnchantmentName[]> =
      Object.fromEntries(
        Object.entries(armorSockets).map(([key, names]) => [
          key,
          [...(names ?? [])],
        ]),
      );

    const updatedEnchantments = character.loadout.enchantments.map(
      (binding) => {
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
      },
    );

    character.loadout = {
      ...character.loadout,
      enchantments: updatedEnchantments,
    };
    character.equipped = {
      weapon,
      armor,
      /* Collect enchantments whose socket matches either equipped item. */
      enchantments: updatedEnchantments
        .filter(
          (binding) => binding.socket === weapon || binding.socket === armor,
        )
        .map((binding) => binding.name),
    };
    character.pending = { ...character.pending, prepare: 0 };

    const updatedCharacters = { ...game.characters, [characterId]: character };

    const allPrepared = Object.values(updatedCharacters).every(
      (char) =>
        char.team !== "player" || (char as PlayerType).pending.prepare === 0,
    );

    game.characters = updatedCharacters;

    if (allPrepared) {
      game.lobby.status = LobbyStatus.BATTLE;
    }

    connection.meta.games.set(gameId, game);
    sendGame(connection, gameId);
  }
}
