import { useContext } from "react";
import {CharType, GameActions} from "../../../types/game.ts";
import {GameContext, GameDispatchContext} from "../../contexts/GameContext";
import "./StatBlocks.css";

function Player(props: CharType) {
    const { id, name, stats } = props;
    const { hitPoints, physical, speed } = stats;
    const game = useContext(GameContext);
    const dispatch = useContext(GameDispatchContext);
    const activeTurn = game?.turnOrder[0] === id;

    const handleAttack = () => {
        if (dispatch) {
            dispatch({
                type: GameActions.SELECT_ACTION,
                payload: { allow: true, max: 2, mnv: "slap" }
            });
        }
    }

    return (
        <div className={`char-box ${activeTurn && "active-char"}`}>
            <div className="name">
                {name}
            </div>
            <div>
                Hit Points: {hitPoints}
            </div>
            <div>
                Physical: {physical}
            </div>
            <div>
                Speed: {speed}
            </div>
            <button className="hit-box"
                disabled={!activeTurn}
                onClick={handleAttack}
            >
                Hit
            </button>
        </div>
    );
}

export default Player;