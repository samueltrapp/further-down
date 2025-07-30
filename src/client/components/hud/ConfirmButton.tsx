import { useContext } from "react";
import {
  GameContext,
  GameDispatchContext,
} from "../../contexts/GameContext.tsx";
import { turn } from "../../actions/turn.ts";
import { GameActions } from "../../../types/game.ts";
import { ManeuverName } from "../../../types/maneuvers.ts";

export default function ConfirmButton() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);

  return game &&
    game.enableConfirmation &&
    game.selectedManeuver &&
    game.gameId &&
    game.selectedEnemyIds &&
    game.turnOrder[0] ? (
    <button
      className="confirm-button"
      onClick={() => {
        turn({
          maneuver: game.selectedManeuver as ManeuverName,
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
