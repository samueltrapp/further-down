import { CharactersType, TurnLog } from "../game.ts";
import { ManeuverName, TacticName } from "../equipables/actions.ts";

export type ActionCtx = {
  characters: CharactersType;
  sourceId: string;
  playerTargetIds: string[] | undefined;
  enemyTargetIds: string[] | undefined;
  actionName: ManeuverName | TacticName;
  speed: number;
  messages: TurnLog;
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
