export type TeamType = "player" | "enemy";

export type StatName =
  | "currentHitPoints"
  | "hitPoints"
  | "vitality"
  | "currentSpeed"
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
