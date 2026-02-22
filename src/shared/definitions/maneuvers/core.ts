import { ActionCtx } from "../../../types/events/actionCtx.ts";
import { PlayerType } from "../../../types/individual/characters.ts";
import { WeaponName } from "../../../types/equipables/weapons.ts";

export const switchWeapon = (ctx: ActionCtx, weapon: WeaponName) => {
  const { characters, sourceId } = ctx;
  const source = characters[sourceId] as PlayerType | undefined;
  if (!source) {
    return ctx;
  }

  source.rewards.equippedWeapon = weapon;
  return {
    ...ctx,
    characters,
  };
};
