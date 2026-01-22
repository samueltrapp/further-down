export type DamageType = "blunt" | "bladed" | "elemental" | "psychic";

// All maneuvers
export type ManeuverName = "pummel" | "quicksilver" | "deluge" | "ache";

// All tactics
export type TacticName = "sporeBurst" | "bonk";

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
  type: "hit",
  accuracy: number,
  damageType: DamageType,
  strength: number
};

export type HealStep = {
  type: "heal",
  strength: number
};

export type EffectStep = {
  type: "effect",
};

export type StepType = HitStep | HealStep | EffectStep;

type BaseActionType = {
  accuracy: number;
  description: string;
  speedCost: number;
  maxTargets: number;
  steps: StepType[];
  tags: TagType[];
};

export type ManeuverType = BaseActionType & {
  name: ManeuverName;
};

export type TacticType = BaseActionType & {
  name: TacticName;
};
