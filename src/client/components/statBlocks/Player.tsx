import { MouseEvent, useContext } from "react";
import {CharType, GameActions} from "../../../types/game.ts";
import {ManeuverName} from "../../../types/maneuvers.ts";
import {GameContext, GameDispatchContext} from "../../contexts/GameContext";
import "./StatBlocks.css";
import {maneuvers} from "../../../server/actions/mnvDetails.ts";

function Player(props: CharType) {
    const { id, name, stats, knownManeuvers } = props;
    const game = useContext(GameContext);
    const dispatch = useContext(GameDispatchContext);
    const activeTurn = game?.turnOrder[0] === id;

    const handleManeuver = (event: MouseEvent<HTMLButtonElement>) => {
        const target = event.target as HTMLButtonElement;
        const value = target.value as ManeuverName;
        if (dispatch && target.value) {
            dispatch({
                type: GameActions.SELECT_ACTION,
                payload: { allow: true, max: maneuvers[value].maxTargets, mnv: value }
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

            <div className="stat-body">
                <div className="action-column">
                    <input type="radio" id="tech1" name="technique" value="technique1" />
                    <label htmlFor="technique1">Technique 1</label>
                    <input type="radio" id="tech2" name="technique" value="technique2" />
                    <label htmlFor="technique2">Technique 2</label>
                    <input type="radio" id="tech3" name="technique" value="technique3" />
                    <label htmlFor="technique3">Technique 3</label>
                </div>
                <div className="action-column">
                    {knownManeuvers.map((knownManeuver) => (
                        <button
                            className={`maneuver-button ${activeTurn && game?.selectedManeuver === knownManeuver ? "selected-maneuver" : ""}`}
                            disabled={!activeTurn}
                            key={knownManeuver}
                            onClick={handleManeuver}
                            value={knownManeuver}
                        >
                            {">"} {knownManeuver.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Player;