import { useContext } from "react";
import { CharType, StatsType } from "../../../types";
import { GameContext } from "../../contexts/GameContext";
import { socket } from "../../utils/socket";
import "./StatBlocks.css";

function Player(props: CharType) {
    const {id, stats} = props;
    const { name, hitPoints, physical, speed } = stats;

    const game = useContext(GameContext);
    const activeTurn = game?.currentTurn === id;

    // const handleAttack = () => {
    //     if (selectedEnemyIds.length === 0) {
    //         socket.emit("turn", {
    //             action: "ATTACK",
    //             issuerId: id,
    //             targetIds: [selectedEnemyIds]
    //         });
    //     }
    // }

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
            //onClick={handleAttack}
            >
                Hit
            </button>
        </div>
    );
}

export default Player;