import { useState, MouseEvent } from "react";
import {
  PlayerType,
  RewardTypes,
} from "../../../types/individual/characters.ts";
import { finishSkilling, takeReward } from "../../services/skill.ts";
import { StatGrowth } from "./StatGrowth.tsx";
import {
  contextualIndefinite,
  singularize,
  toCaps,
} from "../../utils/formatting.ts";
import { NamePrompt } from "./NamePrompt.tsx";
import { useGame } from "../../hooks/useGame.ts";
import "./Rewards.css";
import { armorMap } from "../../../shared/definitions/armors/sets.ts";
import { enchantmentMap } from "../../../shared/definitions/enchantments/sets.ts";
import { maneuverMap } from "../../../shared/definitions/maneuvers/sets.ts";
import { weaponMap } from "../../../shared/definitions/weapons/sets.ts";
import Button from "../core/Button.tsx";

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

  const rewardMap = (() => {
    switch (rewardType) {
      case "armors":
        return armorMap;
      case "enchantments":
        return enchantmentMap;
      case "maneuvers":
        return maneuverMap;
      case "weapons":
        return weaponMap;
      default:
        return new Map();
    }
  })();

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
    <section className="m0 ta-center">
      <h2>{`Select ${contextualIndefinite(rewardType)} ${singularize(rewardType)}`}</h2>
      <ul className="df fdr jc-center">
        {options.map((option) => {
          const optionDetails = rewardMap.get(option);
          return (
            <li key={option} className="ml4 mr4 reward-card">
              <div>
                <span className="fs3 fw3">{toCaps(optionDetails.name)}</span>
              </div>
              <div>
                <span>{optionDetails.description}</span>
              </div>
              <Button value={option} onClick={submitSelectedReward}>
                Select
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Rewards() {
  const { game } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const userId = localStorage.getItem("userId");

  if (!game || !game.data.characters) {
    return null;
  }

  /* Retrieve all characters controlled by the player and grab the current one */
  const allCharacters = Object.values(game.data.characters);
  const playerCharacters = Array.from(allCharacters).filter(
    (playerCharacter) =>
      playerCharacter.team === "player" && playerCharacter.userId === userId,
  );
  const playerCharacter =
    currentIndex < playerCharacters.length
      ? (playerCharacters[currentIndex] as PlayerType)
      : null;

  const gameId = game.data.lobby.gameId;
  const votes = game.data.lobby.votes;

  const otherProps = {
    gameId,
    character: playerCharacter as PlayerType,
  };

  if (playerCharacter === null) {
    if (gameId && userId && !votes.includes(userId)) {
      finishSkilling({ gameId, userId });
    }
    return <RewardHolding />;
  } else {
    if (!playerCharacter.name) {
      return <NamePrompt gameId={gameId} characterId={playerCharacter.id} />;
    } else if (playerCharacter.pending.maneuvers > 0) {
      return <RewardSelection rewardType="maneuvers" {...otherProps} />;
    } else if (playerCharacter.pending.weapons > 0) {
      return <RewardSelection rewardType="weapons" {...otherProps} />;
    } else if (playerCharacter.pending.armors > 0) {
      return <RewardSelection rewardType="armors" {...otherProps} />;
    } else if (playerCharacter.pending.enchantments > 0) {
      return <RewardSelection rewardType="enchantments" {...otherProps} />;
    } else if (playerCharacter.pending.stats > 0) {
      return (
        <StatGrowth
          points={playerCharacter.pending.stats}
          gameId={gameId}
          character={playerCharacter}
        />
      );
    }
    /* Move to next character when nothing is pending */
    setCurrentIndex(currentIndex + 1);
  }
}
