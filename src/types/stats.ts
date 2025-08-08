export type TeamType = "player" | "enemy";

export type StatsType = {
  // Core
  maxHitPoints: number;
  hitPoints: number;
  speedCapacity: number;
  speed: number;

  // Primary
  physical: number;
  defense: number;
  magical: number;
  resistance: number;

  // Specialty
  bladed: number;
  blunt: number;
  elemental: number;
  psychic: number;
  padding: number;
  plating: number;
  dampening: number;
  warding: number;
};
