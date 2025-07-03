import { useContext } from "react";
import { CharType } from "../../../types";
import { GameContext } from "../../contexts/GameContext";
import "./StatBlocks.css";

function Enemy(props: CharType) {
    const { id, stats } = props;

    const game = useContext(GameContext);
    const activeTurn = game?.currentTurn === id;

    return (
        <div className={`enemy-box ${activeTurn && "active-enemy"}`}>
            <div className="name">
                {stats?.name}
            </div>
            <div>
                Hit Points: {stats?.hitPoints}
            </div>
            <div>
                Physical: {stats?.physical}
            </div>
            <div>
                Speed: {stats?.speed}
            </div>
        </div>
    );
}

export default Enemy;