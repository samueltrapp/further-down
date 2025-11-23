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

  return lobby?.gameId &&
    client &&
    client?.selectedManeuver &&
    client?.selectedWeapon &&
    client?.selectedEnemyIds.length > 0 &&
    currentTurn ? (
    <button
      className="confirm-button"
      onClick={() => {
        playerTurn({
          maneuver: client?.selectedManeuver?.name as ManeuverName,
          weapon: client?.selectedWeapon?.name as WeaponName,
          team: "player",
          gameId: lobby.gameId,
          targetIds: client?.selectedEnemyIds,
          sourceId: currentTurn,
        });
        if (dispatch) {
          dispatch({
            type: GameAction.PLAYER_ACTION,
            payload: {
              maxEnemySelections: 0,
              selectedEnemyIds: [],
              selectedManeuver: null,
            },
          });
        }
      }}
    >
      Confirm
    </button>
  ) : null;
}
