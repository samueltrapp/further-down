export type TeamType = "player" | "enemy";

export type StatName =
  | "maxHitPoints"
  | "hitPoints"
  | "speedCapacity"
  | "speed"
  | "physical"
  | "defense"
  | "magical"
  | "resistance"
  | "bladed"
  | "blunt"
  | "elemental"
  | "psychic"
  | "plating"
  | "padding"
  | "dampening"
  | "warding";

export type StatsType = Record<StatName, number>;
