import { CharactersType } from "../game.ts";

export type ActionCtx = {
  characters: CharactersType;
  sourceId: string;
  friendlyTargetIds: string[] | undefined;
  enemyTargetIds: string[] | undefined;
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
