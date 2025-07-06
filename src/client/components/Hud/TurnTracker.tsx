import {GameContext} from "../../contexts/GameContext.tsx";
import {useContext} from "react";
import "./TurnTracker.css";


export default function TurnTracker() {
    const game = useContext(GameContext);

    const turnTracker = game?.turnOrder.map((turnId) => {
        const turnChar = game?.characters?.find((character) => character.id === turnId);
        return {
            name: turnChar?.name,
            speed: turnChar?.stats.speed
        }
    });

    return (
        <div className="turn-tracker-container">
            {turnTracker?.map((turn, index) => (
                <div className="turn-tracker" key={game?.turnOrder[index]}>
                    <div className="name-label">{turn.name}</div>
                    <div className="speed-label">{turn.speed}</div>
                </div>
            ))}
        </div>
    );
}