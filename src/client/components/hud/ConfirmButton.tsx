import { useContext } from "react";
import { playerTurn } from "../../services/turn.ts";
import {
  GameContext,
  GameDispatchContext,
} from "../../contexts/GameContext.tsx";
import { GameAction } from "../../contexts/ContextTypes.ts";
import { ManeuverName } from "../../../types/equipables/actions.ts";
import { WeaponName } from "../../../types/equipables/weapons.ts";

export default function ConfirmButton() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);
  const client = game?.client;
  const lobby = game?.data.lobby;
  const currentTurn = game?.data.battle?.turnOrder[0];

  const enabled =
    lobby?.gameId &&
    client &&
    client?.selectedManeuver &&
    client?.selectedWeapon &&
    client?.selectedEnemyIds.length > 0 &&
    currentTurn;

  function handleConfirm() {
    if (!enabled) return;
    playerTurn({
      maneuver: client.selectedManeuver as ManeuverName,
      weapon: client.selectedWeapon as WeaponName,
      team: "player",
      gameId: lobby.gameId,
      enemyTargetIds: client.selectedEnemyIds,
      friendlyTargetIds: client.selectedEnemyIds,
      sourceId: currentTurn,
    });
    if (dispatch) {
      dispatch({
        type: GameAction.PLAYER_ACTION,
        payload: {
          maxEnemySelections: 0,
          selectedEnemyIds: [],
          selectedFriendlyIds: [],
          selectedManeuver: "",
        },
      });
    }
  }

  return (
    <button
      className="confirm-button"
      disabled={!enabled}
      onClick={handleConfirm}
    >
      Confirm
    </button>
  );
}
