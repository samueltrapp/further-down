import {useContext} from "react";
import {GameContext} from "../../contexts/GameContext.tsx";
import {turn} from "../../actions/turn.ts";

export default function ConfirmButton() {
    const game = useContext(GameContext);

    return !game?.allowSelection ? null : (
        <button
        onClick={() => turn({
            maneuver: game?.selectedManeuver,
            gameId: game?.gameId,
            targetIds: game?.selectedEnemyIds,
            issuerId: game?.turnOrder[0]
        })}>
            Confirm
        </button>
    );
}