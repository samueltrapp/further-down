import {useContext} from "react";
import {GameContext, GameDispatchContext} from "../../contexts/GameContext.tsx";
import {turn} from "../../actions/turn.ts";
import {GameActions} from "../../../types/game.ts";

export default function ConfirmButton() {
    const game = useContext(GameContext);
    const dispatch = useContext(GameDispatchContext);

    return !game?.allowSelection ? null : (
        <button
            className="confirm-button"
            onClick={() => {
                turn({
                    maneuver: game?.selectedManeuver,
                    gameId: game?.gameId,
                    targetIds: game?.selectedEnemyIds,
                    issuerId: game?.turnOrder[0]
                });
                if (dispatch) dispatch({type: GameActions.SELECT_ENEMY, payload: null});
            }}
        >
            Confirm
        </button>
    );
}