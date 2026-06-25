export type StatsType = {
  core: {
    vitality: number; // Base life stat
    protection: number; // Life stat modifier from armor
    life: number;
    maxLife: number;
    initiative: number; // Base speed stat
    finesse: number; // Speed stat modifier from armor
    speed: number;
    maxSpeed: number;
  };
  discipline: {
    martial: number; // Physical damage
    mystic: number; // Magical damage
    defense: number; // Physical mitigation
    resistance: number; // Magical mitigation
    precision: number; // Physical chance to hit
    control: number; // Magical chance to hit
    dodge: number; // Physical chance to dodge
    negation: number; // Magical chance to dodge
  };
  mastery: {
    bladed: number;
    blunt: number;
    elemental: number;
    psychic: number;
    plating: number;
    padding: number;
    dampening: number;
    warding: number;
  };
};
