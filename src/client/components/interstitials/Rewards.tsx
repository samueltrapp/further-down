import { useState, MouseEvent } from "react";
import {
  PlayerType,
  RewardTypes,
} from "../../../types/individual/characters.ts";
import { finishSkilling, takeReward } from "../../services/skill.ts";
import { StatGrowth } from "./StatGrowth.tsx";
import { contextualIndefinite, singularize } from "../../utils/formatting.ts";
import { NamePrompt } from "./NamePrompt.tsx";
import { useGame } from "../../hooks/useGame.ts";

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
  const options = character.private.queue[rewardType].slice(0, 3);

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
  const { game } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const userId = localStorage.getItem("userId");

  if (!game || !game.data.characters) {
    return null;
  }

  const gameId = game.data.lobby.gameId;
  const votes = game.data.lobby.votes;
  const playerCharacters = Array.from(
    Object.values(game.data.characters),
  ).filter(
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
    } else if (currentPlayerCharacter.pending.maneuvers > 0) {
      return (
        <RewardSelection
          rewardType="maneuvers"
          gameId={gameId}
          character={currentPlayerCharacter}
        />
      );
    } else if (currentPlayerCharacter.pending.weapons > 0) {
      return (
        <RewardSelection
          rewardType="weapons"
          gameId={gameId}
          character={currentPlayerCharacter}
        />
      );
    } else if (currentPlayerCharacter.pending.armors > 0) {
      return (
        <RewardSelection
          rewardType="armors"
          gameId={gameId}
          character={currentPlayerCharacter}
        />
      );
    } else if (currentPlayerCharacter.pending.enchantments > 0) {
      return (
        <RewardSelection
          rewardType="enchantments"
          gameId={gameId}
          character={currentPlayerCharacter}
        />
      );
    } else if (currentPlayerCharacter.pending.stats > 0) {
      return (
        <StatGrowth
          points={currentPlayerCharacter.pending.stats}
          gameId={gameId}
          character={currentPlayerCharacter}
        />
      );
    }
    setCurrentIndex(currentIndex + 1);
  }
}
