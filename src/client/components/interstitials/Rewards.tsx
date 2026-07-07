import { useEffect, MouseEvent } from "react";
import {
  PlayerType,
  PendingRewardType,
  PendingStatsType,
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
import Button from "../_core/Button.tsx";
import { StatCategory } from "../../../types/events/skill.ts";
import {blessingMap} from "../../../shared/definitions/blessings/sets.ts";

const REWARD_ORDER: RewardTypes[] = [
  "blessings",
  "maneuvers",
  "weapons",
  "armors",
  "enchantments",
];
const STAT_ORDER: StatCategory[] = ["core", "discipline", "mastery"];

type ActiveStep =
  | { kind: "name" }
  | { kind: "reward"; rewardType: RewardTypes }
  | { kind: "stat"; category: StatCategory };

/* Returns the first uncompleted step for a character, or null if all done. */
function resolveActiveStep(character: PlayerType): ActiveStep | null {
  if (!character.name) return { kind: "name" };

  const pendingReward = REWARD_ORDER.find(
    (reward) => (character.pending as PendingRewardType)[reward] > 0,
  );
  if (pendingReward) return { kind: "reward", rewardType: pendingReward };

  const pendingStat = STAT_ORDER.find(
    (stat) => (character.pending as PendingStatsType)[stat] > 0,
  );
  if (pendingStat) return { kind: "stat", category: pendingStat };

  return null;
}

function hasPending(character: PlayerType): boolean {
  return resolveActiveStep(character) !== null;
}

const REWARD_MAPS: Record<
  RewardTypes,
  Map<string, { name: string; description: string }>
> = {
  armors: armorMap as Map<string, { name: string; description: string }>,
  blessings: blessingMap as Map<string, {name: string, description: string}>,
  enchantments: enchantmentMap as Map<string, { name: string; description: string }>,
  maneuvers: maneuverMap as Map<string, { name: string; description: string }>,
  weapons: weaponMap as Map<string, { name: string; description: string }>,
};

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
  const rewardMap = REWARD_MAPS[rewardType];

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
      <ul className="reward-grid pl0">
        {options.map((option) => {
          const optionDetails = rewardMap.get(option);
          if (!optionDetails) return null;
          return (
            <li key={option} className="reward-option-container">
              <Button
                className="w100 pl4 pr4 reward-card"
                value={option}
                onClick={submitSelectedReward}
              >
                <div className="pt4 pb3 pe-none">
                  <span className="fs3 fw3">{toCaps(optionDetails.name)}</span>
                </div>
                <div className="pb4 pe-none">
                  <span>{optionDetails.description}</span>
                </div>
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
  const userId = localStorage.getItem("userId");

  const gameId = game?.data.lobby.gameId;
  const votes = game?.data.lobby.votes;

  /* First character belonging to this user that still has pending work. */
  const activeCharacter = game?.data.characters
    ? (Object.values(game.data.characters).find(
        (character) =>
          character.team === "player" &&
          character.userId === userId &&
          hasPending(character as PlayerType),
      ) as PlayerType | undefined)
    : undefined;

  /* Once all this user's characters are clear, cast a vote to advance. */
  useEffect(() => {
    if (
      !activeCharacter &&
      gameId &&
      userId &&
      !(votes ?? []).includes(userId)
    ) {
      finishSkilling({ gameId, userId });
    }
  }, [activeCharacter, gameId, userId, votes]);

  if (!game?.data.characters || !gameId) return null;
  if (!activeCharacter) return <RewardHolding />;

  const step = resolveActiveStep(activeCharacter);

  if (step?.kind === "name") {
    return <NamePrompt gameId={gameId} characterId={activeCharacter.id} />;
  }

  if (step?.kind === "reward") {
    return (
      <RewardSelection
        rewardType={step.rewardType}
        character={activeCharacter}
        gameId={gameId}
      />
    );
  }

  if (step?.kind === "stat") {
    return (
      <StatGrowth
        points={activeCharacter.pending[step.category]}
        category={step.category}
        gameId={gameId}
        character={activeCharacter}
      />
    );
  }

  return null;
}
