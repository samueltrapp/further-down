import {useContext} from "react";
import {GameContext} from "../../contexts/GameContext.tsx";

export default function ConfirmButton() {
    const game = useContext(GameContext);

    return !game?.allowSelection ? null : (
        <button>
            Confirm
        </button>
    );
}