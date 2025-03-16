import { useContext } from "react";
import { StatsType } from "../../../types";
import { GameContext } from "../../contexts/GameContext";
import { socket } from "../../utils/socket";
import "./StatBlocks.css";

function Player({id, player, isUp}: {id: string, player: StatsType, isUp: boolean}) {
    const { characterData, selectedEnemyId} = useContext(GameContext);
    const { name, hitPoints, physical, speed } = player;

    const handleAttack = () => {
        if (selectedEnemyId !== "") {
            socket.emit("turn", {
                action: "ATTACK",
                issuerId: id,
                targetIds: [selectedEnemyId]
            });
        }
    }

    return (
        <div className={`char-box ${isUp && "active-char"}`}>
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
            <button className="hit-box" onClick={handleAttack}>
                Hit
            </button>
        </div>
    );
}

export default Player;