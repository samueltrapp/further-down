import { PerspectiveType, TeamType } from "../individual/characters.ts";
import { BurdenName, FavorName } from "./effects.ts";

export type DamageType = "blunt" | "bladed" | "elemental" | "psychic";

// All maneuvers
const PlayerManeuvers = ["ache", "deluge", "pummel", "quicksilver"] as const;
type PlayerManeuvers = (typeof PlayerManeuvers)[number];

const EnemyManeuvers = ["bonk", "pass"] as const;
type EnemyManeuvers = (typeof EnemyManeuvers)[number];

export type ManeuverName = PlayerManeuvers | EnemyManeuvers;
export type TargetMethodType = "select" | "self" | "all" | "random" | "special";

export type TagType =
  | "attack" // Damages life
  | "protect" // In response to losing life
  | "pure" // Only deals one type of damage
  | "mixed" // Deals multiple types of damage
  | "single" // One hit
  | "multi" // Multiple hits
  | "heal" // Increases life actively
  | "regeneration" // Restores life passively
  | "favor" // Applies favor
  | "burden" // Applies burden
  | DamageType;

export type HitStep = {
  type: "hit";
  accuracy: number;
  damageType: DamageType;
  strength: number;
};

export type HealStep = {
  type: "heal";
  strength: number;
};

export type EffectStep = {
  type: "effect";
  burden?: BurdenName;
  favor?: FavorName;
  stacks?: number;
};

export type StepType = HitStep | HealStep | EffectStep;

export type ManeuverType = {
  name: ManeuverName;
  team: TeamType;
  description: string;
  speedCost: number;
  perspective: PerspectiveType;
  targetMethod: TargetMethodType;
  maxTargets: number;
  steps: StepType[];
  tags: TagType[];
};
