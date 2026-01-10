export type EnchantmentName = "discipline" | "killerInstinct" | "redFang" | "thousandCuts";

export type EnchantmentType = {
  name: EnchantmentName;
  type: "hit" | "turn" | "round";
  description: string;
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
