type AspectName = "ghostly" | "flaming";

type EnchantmentName = "lethal" | "silver";

export type WeaponName = "sword" | "bow";

type AffinitiesType = {
  physical: number;
  magical: number;
  bladed: number;
  blunt: number;
  elemental: number;
  psychic: number;
};

type AspectType = {
  aspName: AspectName;
  preOrPost: "pre" | "post";
};

type EnchantmentType = {
  enchName: EnchantmentName;
};

export type WeaponType = {
  name: WeaponName;
  power: number;
  spread: number;
  affinities: AffinitiesType;
  level: number;
  rarity: number;
  equipped: boolean;
  aspects?: AspectType[];
  enchantments?: EnchantmentType[];
};
