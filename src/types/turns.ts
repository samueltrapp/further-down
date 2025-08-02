export type DamageType = "blunt" | "bladed" | "elemental" | "psychic";

export type MvnOrTctType = {
  speedCost: number;
  maxTargets: number;
  actions: {
    damageType: DamageType;
    strength: number;
  }[];
};
