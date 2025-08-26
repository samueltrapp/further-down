import { useContext } from "react";
import { playerTurn } from "../../services/turn.ts";
import {
  GameContext,
  GameDispatchContext,
} from "../../contexts/GameContext.tsx";
import { GameAction } from "../../contexts/ContextTypes.ts";
import { ManeuverName } from "../../../types/equipables/maneuvers.ts";
import { WeaponName } from "../../../types/equipables/weapons.ts";

export default function ConfirmButton() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);
  const client = game?.client;
  const lobby = game?.data.lobby;
  const currentTurn = game?.data.battle?.turnOrder[0];

  return client &&
    client?.enableConfirmation &&
    client?.selectedManeuver &&
    client?.selectedWeapon &&
    client?.selectedEnemyIds &&
    currentTurn &&
    lobby?.gameId ? (
    <button
      className="confirm-button"
      onClick={() => {
        playerTurn({
          maneuver: client?.selectedManeuver?.name as ManeuverName,
          weapon: client?.selectedWeapon?.name as WeaponName,
          team: "player",
          gameId: lobby.gameId,
          targetIds: client?.selectedEnemyIds,
          issuerId: currentTurn,
        });
        if (dispatch) {
          dispatch({ type: GameAction.SELECT_ENEMY, payload: null });
          dispatch({
            type: GameAction.SELECT_MANEUVER,
            payload: {
              maneuverSelected: false,
              maxTargets: 0,
              maneuver: undefined,
            },
          });
        }
      }}
    >
      Confirm
    </button>
  ) : null;
}
