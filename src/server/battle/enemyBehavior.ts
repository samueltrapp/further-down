import { GameType } from "../../types/game.ts";
import { TacticName } from "../../types/equipables/actions.ts";
import { tacticMap } from "../../shared/definitions/tactics/sets.ts";
import { randEntry, randNum } from "../../common/utils.ts";
import { handleTurn } from "../meta/turnHandler.ts";
import { ConnectionType } from "../../types/server.ts";
import { EnemyTurnType } from "../../types/events/turn.ts";

type DecisionType = {
  priority: number;
  tactic: TacticName;
};

// candidate: TacticName, game: GameType
const assessTactic = () => {
  return randNum(30);
};

const pickTargets = (candidate: TacticName, game: GameType) => {
  const selectedTargets: string[] = [];
  const tactic = tacticMap.get(candidate);
  if (tactic && game.characters) {
    /* Get list of all potential targets based on tactic details */
    let viableTargets = Object.values(game.characters).reduce(
      (targets: string[], character) => {
        if (character.team === tactic.targetTeam) {
          targets.push(character.id);
        }
        return targets;
      },
      [],
    );
    /* Pick actual targets */
    while (
      selectedTargets.length < tactic.maxTargets &&
      viableTargets.length > 0
    ) {
      const { pick, altered } = randEntry(viableTargets) as {
        pick: string;
        altered: string[];
      }; // TODO: non-random unit selection
      selectedTargets.push(pick);
      viableTargets = altered;
    }
  }

  return selectedTargets;
};

export const decideEnemyTurn = (
  connection: ConnectionType,
  gameId: string,
  game: GameType,
  sourceId: string,
) => {
  const character = game.characters?.[sourceId];
  if (!character || character.team !== "enemy") {
    return null;
  }

  const decision = character.tactics.reduce(
    (decision: DecisionType, candidate) => {
      const candidatePriority = assessTactic(); // TODO: Actual assessment
      return candidatePriority > decision.priority
        ? {
            priority: candidatePriority,
            tactic: candidate,
          }
        : decision;
    },
    {
      priority: 0,
      tactic: "pass",
    },
  );

  const targets = pickTargets(decision.tactic, game);
  const turn: EnemyTurnType = {
    gameId,
    sourceId,
    playerTargetIds: targets,
    enemyTargetIds: [],
    tactic: decision.tactic,
    team: "enemy",
  };
  handleTurn(connection, turn);
};
