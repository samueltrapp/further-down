import { useContext, useState, MouseEvent } from "react";
import { GameContext } from "../../contexts/GameContext.tsx";
import {
  PlayerType,
  RewardTypes,
} from "../../../types/individual/characters.ts";
import { finishSkilling, takeReward } from "../../services/skill.ts";
import { StatGrowth } from "./StatGrowth.tsx";
import { contextualIndefinite, singularize } from "../../utils/formatting.ts";
import { NamePrompt } from "./NamePrompt.tsx";

function RewardHolding() {
  return <div>Waiting for other players.</div>;
}

function RewardSelection({
  rewardType,
  character,
  gameId,
}: {
  rewardType: RewardTypes;
  character: PlayerType;
  gameId: string;
}) {
  const options = character.rewards.queue[rewardType].slice(0, 3);

  const submitSelectedReward = (event: MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    takeReward({
      rewardType,
      rewardName: target.value,
      gameId,
      characterId: character.id,
    });
  };

  return (
    <div>
      <h2>{`Select ${contextualIndefinite(rewardType)} ${singularize(rewardType)}`}</h2>
      {options.map((option) => (
        <button key={option} value={option} onClick={submitSelectedReward}>
          <div style={{ pointerEvents: "none" }}>{option}</div>
        </button>
      ))}
    </div>
  );
}

export function Rewards() {
  const game = useContext(GameContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const userId = localStorage.getItem("userId");

  if (!game) {
    return null;
  }

  const gameId = game.data.lobby.gameId;
  const votes = game.data.lobby.votes;
  const playerCharacters = Array.from(game.data.characters.values()).filter(
    (playerCharacter) =>
      playerCharacter.team === "player" && playerCharacter.userId === userId,
  );

  if (currentIndex > playerCharacters.length - 1) {
    if (gameId && userId && !votes.includes(userId)) {
      finishSkilling({ gameId, userId });
    }
    return <RewardHolding />;
  } else {
    const currentPlayerCharacter = playerCharacters[currentIndex] as PlayerType;

    if (!currentPlayerCharacter.name) {
      return (
        <NamePrompt gameId={gameId} characterId={currentPlayerCharacter.id} />
      );
    } else if (currentPlayerCharacter.rewards.pending.maneuvers > 0) {
      return (
        <RewardSelection
          rewardType="maneuvers"
          gameId={gameId}
          character={currentPlayerCharacter}
        />
      );
    } else if (currentPlayerCharacter.rewards.pending.weapons > 0) {
      return (
        <RewardSelection
          rewardType="weapons"
          gameId={gameId}
          character={currentPlayerCharacter}
        />
      );
    } else if (currentPlayerCharacter.rewards.pending.armors > 0) {
      return (
        <RewardSelection
          rewardType="armors"
          gameId={gameId}
          character={currentPlayerCharacter}
        />
      );
    } else if (currentPlayerCharacter.rewards.pending.enchantments > 0) {
      return (
        <RewardSelection
          rewardType="enchantments"
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
    }
    setCurrentIndex(currentIndex + 1);
  }
}
