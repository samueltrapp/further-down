import { EnemyTurnType, PlayerTurnType } from "../../types/events/turn.ts";
import { ConnectionType } from "../../types/server.ts";
import { maneuverMap } from "../../shared/definitions/maneuvers/sets.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { validTargets } from "../../shared/utils.ts";
import { LobbyStatus, Victor } from "../../types/game.ts";

/**
 * Validates a turn submission against game state and constraints.
 * Returns an error message if invalid, or undefined if valid.
 */
export const validateTurn = (
  connection: ConnectionType,
  turn: PlayerTurnType | EnemyTurnType,
  game: ReturnType<typeof connection.meta.games.get>,
): string | undefined => {
  if (
    !game ||
    !game.characters ||
    !game.battle ||
    game.lobby.status !== LobbyStatus.BATTLE ||
    game.battle.victor !== Victor.NONE
  ) {
    return "Invalid turn";
  }

  const { sourceId, targetIds, maneuver: maneuverName, team } = turn;
  const source = game.characters[sourceId];
  const maneuver = maneuverMap.get(maneuverName);

  // Validation 1: Source character must exist
  if (!source) {
    return "Invalid turn";
  }

  // Validation 2: It must be this character's turn
  const expectedSourceId = game.battle.turnOrder[0];
  if (sourceId !== expectedSourceId) {
    return "Invalid turn";
  }

  // Validation 3: Character team must match turn team
  if (source.team !== team) {
    return "Invalid turn";
  }

  // Validation 4: Maneuver must exist
  if (!maneuver) {
    return "Invalid turn";
  }

  // Validation 5: For player turns, verify player ownership and weapon
  if (turn.team === "player") {
    const playerSource = source as PlayerType;

    // Get userId from socket.data (stored explicitly to avoid room ID conflicts)
    const userId = connection.socket.data.userId;

    // Verify player owns this character
    if (playerSource.userId !== userId) {
      return "Invalid turn";
    }

    // Verify weapon is in character's loadout
    if (!playerSource.loadout.weapons.includes(turn.weapon)) {
      return "Invalid turn";
    }
  }

  // Validation 6: Verify maneuver is in character's loadout
  if (!source.loadout.maneuvers.includes(maneuverName)) {
    return "Invalid turn";
  }

  // Validation 7: Validate target count
  if (targetIds.length > maneuver.maxTargets) {
    return "Invalid turn";
  }

  // Validation 8: Validate targets match maneuver perspective and are valid
  const validTargetIds = validTargets(
    game.characters,
    team,
    maneuver.perspective,
  );

  for (const targetId of targetIds) {
    if (!validTargetIds.includes(targetId)) {
      return "Invalid turn";
    }
  }

  // All validations passed
  return undefined;
};
