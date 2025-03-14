import { CharacterState } from "../../types";
import { socket } from "../utils/socket";
import "./Character.css";

function Character({character, isUp}: {character: CharacterState, isUp: boolean}) {
    const { name, hitPoints, physical, speed } = character;

    const handleAttack = () => {
        
        socket.emit("attack", physical);
    }

    return (
        <div className={`char-box ${isUp && "active-char"}`}>
            <div>
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

export default Character;