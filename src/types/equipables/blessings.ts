import { EnchantmentType } from "./enchantments.ts";

export type BlessingName = "eternal flame";

export type BlessingType = Omit<EnchantmentType, "name" | "socketType"> & {
  name: BlessingName;
};
