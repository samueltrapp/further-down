import { useContext } from "react";
import { CharType } from "../../../types/game.ts";
import { GameContext } from "../../contexts/GameContext";
import "./StatBlocks.css";

function Player(props: CharType) {
    const {id, name, stats} = props;
    const { hitPoints, physical, speed } = stats;

    const game = useContext(GameContext);
    const activeTurn = game?.turnOrder[0] === id;

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
            //onClick={handleAttack}
            >
                Hit
            </button>
        </div>
    );
}

export default Player;