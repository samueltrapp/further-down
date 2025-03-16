import { StatsType } from "../../../types";
import "./StatBlocks.css";

function Enemy({id, enemy, selected}: {id: string, enemy: StatsType, selected: boolean}) {
    const { name, hitPoints, physical, speed } = enemy;

    return (
        <div className={`enemy-box ${selected && "active-enemy"}`}>
            <div className="name">
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