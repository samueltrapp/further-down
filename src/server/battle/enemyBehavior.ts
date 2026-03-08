import { GameType } from "../../types/game.ts";
import { randEntry, randNum } from "../../shared/utils.ts";
import { handleTurn } from "../meta/turnHandler.ts";
import { ConnectionType } from "../../types/server.ts";
import { EnemyTurnType } from "../../types/events/turn.ts";
import { ManeuverName } from "../../types/equipables/actions.ts";
import { maneuverMap } from "../../shared/definitions/maneuvers/sets.ts";

type DecisionType = {
  priority: number;
  maneuver: ManeuverName;
};

// candidate: TacticName, game: GameType
const assessTactic = () => {
  return randNum(30);
};

const pickTargets = (candidate: ManeuverName, game: GameType) => {
  const selectedTargets: string[] = [];
  const tactic = maneuverMap.get(candidate);
  if (tactic && game.characters) {
    /* Get list of all potential targets based on tactic details */
    let viableTargets = Object.values(game.characters).reduce(
      (targets: string[], character) => {
        if (character.team === tactic.targetTeam && !character.isDead) {
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

  const decision = character.loadout.maneuvers.reduce(
    (decision: DecisionType, candidate) => {
      const candidatePriority = assessTactic(); // TODO: Actual assessment
      return candidatePriority > decision.priority
        ? {
            priority: candidatePriority,
            maneuver: candidate,
          }
        : decision;
    },
    {
      priority: 0,
      maneuver: "pass" as ManeuverName,
    },
  );

  const targets = pickTargets(decision.maneuver, game);
  const turn: EnemyTurnType = {
    gameId,
    sourceId,
    targetIds: targets,
    maneuver: decision.maneuver,
    team: "enemy",
  };

  /* Delay enemy turns to provide visible feedback */
  setTimeout(() => handleTurn(connection, turn), 1000 + randNum(1500));
};
