export type TeamType = "player" | "enemy";

export type StatsType = {
  // Core
  maxHitPoints: number;
  hitPoints: number;
  maxSpeed: number;
  speed: number;
  luck: number;

  // Primary
  physical: number;
  armor: number;
  magical: number;
  resistance: number;
  martial: number;
  mystic: number;

  // Specialty
  bladed: number;
  blunt: number;
  elemental: number;
  psychic: number;
  padding: number;
  plating: number;
  dampening: number;
  warding: number;
  accuracy: number;
  evasion: number;
  control: number;
  absorption: number;
};
