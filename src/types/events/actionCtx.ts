import { CharactersType, TurnLog } from "../game.ts";
import { ManeuverName } from "../equipables/actions.ts";

export type ActionCtx = {
  characters: CharactersType;
  sourceId: string;
  targetIds: string[] | undefined;
  maneuverName: ManeuverName;
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
