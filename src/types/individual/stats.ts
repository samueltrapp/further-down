export type StatsType = {
  core: {
    vitality: number;
    life: number;
    maxLife: number;
    initiative: number; // Base speed stat
    speed: number;
    maxSpeed: number;
  };
  discipline: {
    martial: number; // Physical damage scaling (bladed, blunt)
    mystic: number; // Magical damage scaling (elemental, psychic)
    defense: number; // Bladed and blunt mitigation
    resistance: number; // Elemental and psychic mitigation
    precision: number; // Bladed and blunt accuracy
    control: number; // Elemental and psychic accuracy
    dodge: number; // Bladed and blunt evasion
    negation: number; // Elemental and psychic evasion
  };
  mastery: {
    bladed: number;
    blunt: number;
    elemental: number;
    psychic: number;
    plating: number; // Bladed damage mitigation
    padding: number; // Blunt damage mitigation
    dampening: number; // Elemental damage mitigation
    warding: number; // Psychic damage mitigation
  };
};
