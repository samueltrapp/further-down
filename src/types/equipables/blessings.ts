export type BlessingName = "angelblade" | "flow" | "pacifist" | "predation";

export type TimingType = "before" | "after";

export type BlessingType = {
  name: BlessingName;
  description: string;
  timing: TimingType;
};
