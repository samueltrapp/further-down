import { CharactersType, TurnLog } from "../game.ts";
import { ManeuverType, StepType } from "../equipables/maneuvers.ts";

export type TargetInstanceDetail = {
  damage: number;
  mitigation: number;
  heal: number;
  evaded: boolean;
};

export type StepResult = {
  step: StepType;
  targetIds: string[];
  instance: Map<string, TargetInstanceDetail>;
};

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
  instance: Map<string, TargetInstanceDetail>;
  heal: number;
  round: number;
  previousResults: StepResult[];
};
