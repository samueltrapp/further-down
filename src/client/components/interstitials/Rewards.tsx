import { useContext, useState, MouseEvent } from "react";
import { GameContext } from "../../contexts/GameContext.tsx";
import { RewardOptions } from "../../../types/individual/characters.ts";
import { ArmorType } from "../../../types/equipables/armors.ts";
import { BlessingType } from "../../../types/equipables/blessings.ts";
import { CurseType } from "../../../types/equipables/curses.ts";
import { ManeuverType } from "../../../types/equipables/maneuvers.ts";
import { EnchantmentType } from "../../../types/equipables/enchantments.ts";
import { WeaponType } from "../../../types/equipables/weapons.ts";
import { takeReward } from "../../services/skill.ts";
import { StatGrowth } from "./StatGrowth.tsx";

function RewardHolding() {
  return <div>Waiting for other players.</div>;
}

function RewardSelection({
  rewardOption,
  ownedSelections,
  characterId,
}: {
  rewardOption: RewardOptions;
  ownedSelections: (
    | ArmorType
    | BlessingType
    | CurseType
    | EnchantmentType
    | ManeuverType
    | WeaponType
  )[];
  characterId: string;
}) {
  const game = useContext(GameContext);
  const rewardLib = game?.data.lib[rewardOption];

  const remainingOptions = rewardLib!.filter(
    (reward) =>
      !ownedSelections.some(
        (ownedSelection) => ownedSelection.name === reward.name,
      ),
  );
  const options = [];
  for (let optionIndex = 0; optionIndex < 3; optionIndex++) {
    const randomIndex = Math.floor(Math.random() * remainingOptions.length);
    options.push(remainingOptions[randomIndex]);
    remainingOptions.splice(randomIndex, 1);
  }

  const submitSelectedReward = (event: MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    takeReward({
      rewardOption,
      rewardName: target.value,
      gameId: game!.data.lobby.gameId,
      characterId,
    });
  };

  return (
    <div>
      {options.map((option) => (
        <button
          key={option.name}
          value={option.name}
          onClick={submitSelectedReward}
        >
          <div style={{ pointerEvents: "none" }}>{option.name}</div>
          <div style={{ pointerEvents: "none" }}>{option.description}</div>
        </button>
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
  const characterId = currentPlayerCharacter.id;

  if (currentIndex > playerCharacters.length - 1) {
    return <RewardHolding />;
  } else if (currentPlayerCharacter.pendingRewards.curses > 0) {
    return (
      <RewardSelection
        rewardOption="curses"
        ownedSelections={currentPlayerCharacter.rewards.curses}
        characterId={characterId}
      />
    );
  } else if (currentPlayerCharacter.pendingRewards.blessings > 0) {
    return (
      <RewardSelection
        rewardOption="blessings"
        ownedSelections={currentPlayerCharacter.rewards.blessings}
        characterId={characterId}
      />
    );
  } else if (currentPlayerCharacter.pendingRewards.maneuvers > 0) {
    return (
      <RewardSelection
        rewardOption="maneuvers"
        ownedSelections={currentPlayerCharacter.rewards.maneuvers}
        characterId={characterId}
      />
    );
  } else if (currentPlayerCharacter.pendingRewards.weapons > 0) {
    return (
      <RewardSelection
        rewardOption="weapons"
        ownedSelections={currentPlayerCharacter.rewards.weapons}
        characterId={characterId}
      />
    );
  } else if (currentPlayerCharacter.pendingRewards.armors > 0) {
    return (
      <RewardSelection
        rewardOption="armors"
        ownedSelections={currentPlayerCharacter.rewards.armors}
        characterId={characterId}
      />
    );
  } else if (currentPlayerCharacter.pendingRewards.enchantments > 0) {
    return (
      <RewardSelection
        rewardOption="enchantments"
        ownedSelections={currentPlayerCharacter.rewards.enchantments}
        characterId={characterId}
      />
    );
  } else if (currentPlayerCharacter.pendingRewards.stats > 0) {
    return (
      <StatGrowth
        characterId={characterId}
        points={currentPlayerCharacter.pendingRewards.stats}
      />
    );
  } else {
    setCurrentIndex(currentIndex + 1);
  }
}
