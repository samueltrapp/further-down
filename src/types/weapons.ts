type AspectName = "ghostly" | "flaming";

type EnchantmentName = "lethal" | "silver";

export type WeaponName = "sword" | "bow";

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
  level: number;
  rarity: number;
  aspects?: AspectType[];
  enchantments?: EnchantmentType[];
};
