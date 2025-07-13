import { useContext } from "react";
import {CharType, GameActions} from "../../../types/game.ts";
import {GameContext, GameDispatchContext} from "../../contexts/GameContext";
import "./StatBlocks.css";

function Player(props: CharType) {
    const { id, name, stats } = props;
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
        <div className={`char-box player-box ${activeTurn && "active-char"}`}>
            <div className="id-bar">
                <div className="hp-display">
                    {stats.hitPoints}
                </div>
                <div className="name">
                    {name}
                </div>
                <div className="speed-display">
                    {stats.speed}
                </div>
            </div>
            {activeTurn && (
                <>
                    <div>
                        Blt: {stats.physical + stats.blunt}
                    </div>
                    <div>
                        Bld: {stats.physical + stats.bladed}
                    </div>
                    <div>
                        Ele: {stats.magical + stats.elemental}
                    </div>
                    <div>
                        Psy: {stats.magical + stats.psychic}
                    </div>
                </>
            )}

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