import { TeamType } from "../individual/characters.ts";

const PlayerArmorName = ["leather", "platemail", "robe", "tunic"] as const;
type PlayerArmorName = (typeof PlayerArmorName)[number];

const EnemyArmorName = ["porous body"] as const;
type EnemyArmorName = (typeof EnemyArmorName)[number];

export type ArmorName = PlayerArmorName | EnemyArmorName;

type DefensiveAffinitiesType = {
  defense: number;
  resistance: number;
  plating: number;
  padding: number;
  dampening: number;
  warding: number;
};

export type ArmorType = {
  name: ArmorName;
  team: TeamType;
  block: number;
  protection: number;
  finesse: number;
  affinities: DefensiveAffinitiesType;
  tier: number;
  rarity: number;
  socketSize: number;
  description: string;
};
