import { createContext, Dispatch, SetStateAction } from "react";
import { RewardStateType } from "../../types/game.ts";

export const RewardContext = createContext<RewardStateType | null>(null);
export const RewardStateContext = createContext<Dispatch<
  SetStateAction<RewardStateType>
> | null>(null);

/*
    Pending Rewards

    Blessings
    Curses
    Maneuvers
    Weapons
    Armor
    Enchantments
 */
