import { useContext } from "react";
import {
  GameContext,
  GameDispatchContext,
} from "../../contexts/GameContext.tsx";
import { playerTurn } from "../../utils/turn.ts";
import { GameActions } from "../../../types/game.ts";
import { ManeuverName } from "../../../types/maneuvers.ts";
import { WeaponName } from "../../../types/weapons.ts";

export default function ConfirmButton() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);

  return game &&
    game.enableConfirmation &&
    game.selectedManeuver &&
    game.gameId &&
    game.selectedWeapon &&
    game.selectedEnemyIds &&
    game.turnOrder[0] ? (
    <button
      className="confirm-button"
      onClick={() => {
        playerTurn({
          maneuver: game.selectedManeuver as ManeuverName,
          weapon: game?.selectedWeapon as WeaponName,
          team: "player",
          gameId: game.gameId,
          targetIds: game.selectedEnemyIds,
          issuerId: game.turnOrder[0],
        });
        if (dispatch) {
          dispatch({ type: GameActions.SELECT_ENEMY, payload: null });
          dispatch({
            type: GameActions.SELECT_MANEUVER,
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
