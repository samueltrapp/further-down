const BurdenName = ["anguish"] as const;
const FavorName = ["sharpen the blade", "verve"] as const;

export type BurdenName = (typeof BurdenName)[number];
export type FavorName = (typeof FavorName)[number];

type DurationType =
  | "instant"
  | "hit"
  | "turn"
  | "round"
  | "battle"
  | "permanent";

export type EffectType = {
  stackable: boolean;
  duration: DurationType;
  onTrigger: () => void;
  onExpire: () => void;
  tooltip: string;
};
