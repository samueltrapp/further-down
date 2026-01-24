import { CharactersType } from "../../../types/game.ts";
import { WeaponType } from "../../../types/equipables/weapons.ts";

export type ActionCtx = {
  characters: CharactersType;
  sourceId: string;
  friendlyTargetIds: string[] | undefined;
  enemyTargetIds: string[] | undefined;
  weapon: WeaponType;
  speed: number;
  messages: string[];
  toHit: number;
  accuracy: number;
  damage: number;
  mitigation: Map<
    string,
    {
      evasion: number;
      reduction: number;
    }
  >;
  heal: number;
};
