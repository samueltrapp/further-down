import {GameContext} from "../../contexts/GameContext.tsx";
import {useContext} from "react";
import "./TurnTracker.css";


export default function TurnTracker() {
    const game = useContext(GameContext);

    const turnTracker = game?.turnOrder.map((turnId) =>
        game?.characters?.find((character) => character.id === turnId)?.name
    );

    return (
        <div className="turn-tracker-container">
            {turnTracker?.map((turn, index) => (
                <div key={game?.turnOrder[index]}>
                    {turn}
                </div>
            ))}
        </div>
    );
}