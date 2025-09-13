import { useContext, useState, MouseEvent, useEffect } from "react";
import { GameContext } from "../../contexts/GameContext.tsx";
import {
  PlayerType,
  RewardOptions,
} from "../../../types/individual/characters.ts";
import { finishSkilling, takeReward } from "../../services/skill.ts";
import { StatGrowth } from "./StatGrowth.tsx";
import { contextualIndefinite, singularize } from "../../utils/formatting.ts";
import { NamePrompt } from "./NamePrompt.tsx";

function RewardHolding({ gameId }: { gameId: string }) {
  useEffect(() => {
    finishSkilling(gameId);
  }, [gameId]);
  return <div>Waiting for other players.</div>;
}

function RewardSelection({
  rewardOption,
  character,
  gameId,
}: {
  rewardOption: RewardOptions;
  character: PlayerType;
  gameId: string;
}) {
  const options = character.rewards.queue[rewardOption].slice(0, 3);

  const submitSelectedReward = (event: MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    takeReward({
      rewardOption,
      rewardName: target.value,
      gameId,
      characterId: character.id,
    });
  };

  return (
    <div>
      <h2>{`Select ${contextualIndefinite(rewardOption)} ${singularize(rewardOption)}`}</h2>
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

  const gameId = game!.data.lobby.gameId;
  const playerCharacters = game!.data.characters.players.filter(
    (playerCharacter) => playerCharacter.userId === user,
  );
  const currentPlayerCharacter: PlayerType | undefined =
    playerCharacters[currentIndex];

  if (currentIndex > playerCharacters.length - 1) {
    return <RewardHolding gameId={game!.data?.lobby.gameId} />;
  } else if (!currentPlayerCharacter.name) {
    return (
      <NamePrompt gameId={gameId} characterId={currentPlayerCharacter.id} />
    );
  } else if (currentPlayerCharacter.rewards.pending.curses > 0) {
    return (
      <RewardSelection
        rewardOption="curses"
        gameId={gameId}
        character={currentPlayerCharacter}
      />
    );
  } else if (currentPlayerCharacter.rewards.pending.blessings > 0) {
    return (
      <RewardSelection
        rewardOption="blessings"
        gameId={gameId}
        character={currentPlayerCharacter}
      />
    );
  } else if (currentPlayerCharacter.rewards.pending.maneuvers > 0) {
    return (
      <RewardSelection
        rewardOption="maneuvers"
        gameId={gameId}
        character={currentPlayerCharacter}
      />
    );
  } else if (currentPlayerCharacter.rewards.pending.weapons > 0) {
    return (
      <RewardSelection
        rewardOption="weapons"
        gameId={gameId}
        character={currentPlayerCharacter}
      />
    );
  } else if (currentPlayerCharacter.rewards.pending.armors > 0) {
    return (
      <RewardSelection
        rewardOption="armors"
        gameId={gameId}
        character={currentPlayerCharacter}
      />
    );
  } else if (currentPlayerCharacter.rewards.pending.enchantments > 0) {
    return (
      <RewardSelection
        rewardOption="enchantments"
        gameId={gameId}
        character={currentPlayerCharacter}
      />
    );
  } else if (currentPlayerCharacter.rewards.pending.stats > 0) {
    return (
      <StatGrowth
        points={currentPlayerCharacter.rewards.pending.stats}
        gameId={gameId}
        character={currentPlayerCharacter}
      />
    );
  } else {
    setCurrentIndex(currentIndex + 1);
  }
}
