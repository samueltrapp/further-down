import { CharacterState } from "../../types";
import "./Enemy.css";

function Enemy({enemy, selected}: {enemy: CharacterState, selected: boolean}) {
    const { name, hitPoints, physical, speed } = enemy;

    return (
        <div className={`enemy-box ${selected ? "active-enemy-box" : "inactive-enemy-box"}`}>
            <div>
                {name}
            </div>
            <div>
                Hit Points: { hitPoints }
            </div>
            <div>
                Physical: { physical }
            </div>
            <div>
                Speed: { speed }
            </div>
        </div>
    );
}

export default Enemy;