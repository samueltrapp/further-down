import { useContext, useState } from "react";
import { GameContext } from "../../contexts/GameContext.tsx";
import { RewardOptions } from "../../../types/individual/characters.ts";
import { ArmorType } from "../../../types/equipables/armors.ts";
import { BlessingName } from "../../../types/equipables/blessings.ts";
import { CurseName } from "../../../types/equipables/curses.ts";
import { ManeuverName } from "../../../types/equipables/maneuvers.ts";
import { EnchantmentName } from "../../../types/equipables/enchantments.ts";
import { WeaponType } from "../../../types/equipables/weapons.ts";

function RewardHolding() {
  return <div>Waiting for other players.</div>;
}

function RewardSelection(
  rewardOption: RewardOptions,
  ownedSelections: (
    | ArmorType
    | BlessingName
    | CurseName
    | EnchantmentName
    | ManeuverName
    | WeaponType
  )[],
) {
  const game = useContext(GameContext);
  const rewardLib = game?.data.lib[rewardOption];

  const remainingOptions = rewardLib!.filter(
    (reward) => !ownedSelections.includes(reward),
  );
  const options = [];
  for (let optionIndex = 0; optionIndex < 3; optionIndex++) {
    const randomIndex = Math.floor(Math.random() * remainingOptions.length);
    options.push(remainingOptions[randomIndex]);
    remainingOptions.splice(randomIndex, 1);
  }

  return (
    <div>
      {options.map((option) => (
        <button>{option}</button>
      ))}
    </div>
  );
}

export function Rewards() {
  const game = useContext(GameContext);
  const [currentIndex, setCurrentIndex] = useState(0);

  const user = localStorage.getItem("userId");
  const playerCharacters = game!.data.characters.players.filter(
    (playerCharacter) => playerCharacter.userId === user,
  );
  const currentPlayerCharacter = playerCharacters[currentIndex];

  if (currentIndex > playerCharacters.length - 1) {
    return <RewardHolding />;
  } else if (currentPlayerCharacter.pendingRewards.curses > 0) {
    return RewardSelection("curses", currentPlayerCharacter.rewards.curses);
  } else if (currentPlayerCharacter.pendingRewards.blessings > 0) {
    return RewardSelection(
      "blessings",
      currentPlayerCharacter.rewards.blessings,
    );
  } else if (currentPlayerCharacter.pendingRewards.maneuvers > 0) {
    return RewardSelection(
      "maneuvers",
      currentPlayerCharacter.rewards.maneuvers,
    );
  } else if (currentPlayerCharacter.pendingRewards.weapons > 0) {
    return RewardSelection("weapons", currentPlayerCharacter.rewards.weapons);
  } else if (currentPlayerCharacter.pendingRewards.armors > 0) {
    return RewardSelection("armors", currentPlayerCharacter.rewards.armors);
  } else if (currentPlayerCharacter.pendingRewards.enchantments > 0) {
    return RewardSelection(
      "enchantments",
      currentPlayerCharacter.rewards.enchantments,
    );
  } else {
    setCurrentIndex(currentIndex + 1);
  }
}
