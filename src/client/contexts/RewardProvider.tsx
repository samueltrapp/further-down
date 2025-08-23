import { ReactNode, useState } from "react";
import {
  RewardContext,
  RewardStateContext,
  RewardStateType,
} from "./RewardContext.tsx";

export const RewardProvider = ({ children }: { children: ReactNode }) => {
  const [reward, setReward] = useState<RewardStateType>({
    pending: {
      blessings: 0,
      curses: 0,
      maneuvers: 0,
      weapons: 0,
      armors: 0,
      enchantments: 0,
    },
    lib: {
      blessings: [],
      curses: [],
      maneuvers: [],
      weapons: [],
      armors: [],
      enchantments: [],
    },
  });

  return (
    <RewardContext value={reward}>
      <RewardStateContext value={setReward}>{children}</RewardStateContext>
    </RewardContext>
  );
};
