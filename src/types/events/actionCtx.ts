import { CharactersType, TurnLog } from "../game.ts";
import { ManeuverType } from "../equipables/maneuvers.ts";

export type ActionCtx = {
  characters: CharactersType;
  sourceId: string;
  targetIds: string[];
  maneuver: ManeuverType;
  speed: number;
  speedElapsed: number;
  messages: TurnLog;
  toHit: number;
  accuracy: number;
  instance: Map<
    string,
    {
      damage: number;
      mitigation: number;
      heal: number;
      evaded: boolean;
    }
  >;
  heal: number;
};
