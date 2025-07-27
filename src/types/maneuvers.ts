export type ManeuverName = "slap" | "quicksilver" | "fireburst" | "ache";

export type DamageType = "blunt" | "bladed" | "elemental" | "psychic";

export type ManeuverType = {
  speedCost: number;
  maxTargets: number;
  actions: {
    damageType: DamageType;
    strength: number;
  }[];
};
