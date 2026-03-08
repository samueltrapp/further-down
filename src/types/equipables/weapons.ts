import { EnchantmentType } from "./enchantments.ts";
import { TeamType } from "../individual/characters.ts";

const PlayerWeaponName = ["cutlass", "hammer", "periapt", "scepter"] as const;
type PlayerWeaponName = (typeof PlayerWeaponName)[number];

const EnemyWeaponName = ["fungal appendage"] as const;
type EnemyWeaponName = (typeof EnemyWeaponName)[number];

export type WeaponName = PlayerWeaponName | EnemyWeaponName;

type OffensiveAffinitiesType = {
  physical: number;
  magical: number;
  bladed: number;
  blunt: number;
  elemental: number;
  psychic: number;
};

export type WeaponType = {
  name: WeaponName;
  team: TeamType;
  power: number;
  spread: number;
  affinities: OffensiveAffinitiesType;
  level: number;
  rarity: number;
  enchantments?: EnchantmentType[];
  description: string;
};
