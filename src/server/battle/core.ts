import { ActionCtx } from "../../types/events/actionCtx.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { WeaponName } from "../../types/equipables/weapons.ts";
import { ConnectionType } from "../../types/server.ts";
import { decideEnemyTurn } from "./enemyBehavior.ts";

export const applyDeath = (ctx: ActionCtx) => {
  const { characters } = ctx;

  for (const character of Object.values(characters)) {
    character.isDead = character.stats.life <= 0;
  }

  return {
    ...ctx,
    characters,
  };
};

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

export const checkNextTurn = (connection: ConnectionType, gameId: string) => {
  const game = connection.meta.games.get(gameId);
  if (game) {
    const turn = game.battle?.turnOrder[0];
    if (turn) {
      const character = game.characters?.[turn];
      const isEnemyTurn = character?.team === "enemy";
      if (isEnemyTurn && character) {
        decideEnemyTurn(connection, gameId, game, character.id);
      }
    }
  }
};
