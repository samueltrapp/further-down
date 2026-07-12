import { EnchantmentType } from "./enchantments.ts";

const BlessingName = ["eternal flame", "tempest"] as const;
export type BlessingName = (typeof BlessingName)[number];

export type BlessingType = Omit<EnchantmentType, "name" | "socketType"> & {
  name: BlessingName;
};
