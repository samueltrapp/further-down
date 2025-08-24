type AspectName = "ghostly" | "flaming";

export type EnchantmentName = "lethal" | "silver";

export type EnchantmentType = {
  enchName: EnchantmentName;
};

export type OffensiveAffinitiesType = {
  physical: number;
  magical: number;
  bladed: number;
  blunt: number;
  elemental: number;
  psychic: number;
};

export type DefensiveAffinitiesType = {
  defense: number;
  resistance: number;
  plating: number;
  padding: number;
  dampening: number;
  warding: number;
};

export type AspectType = {
  aspName: AspectName;
  preOrPost: "pre" | "post";
};
