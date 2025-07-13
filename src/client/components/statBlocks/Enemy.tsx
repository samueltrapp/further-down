import { useContext, useEffect } from "react";
import { CharType } from "../../../types/game.ts";
import { GameContext } from "../../contexts/GameContext";
import "./StatBlocks.css";
import { turn } from "../../actions/turn.ts";

const lowestHpPlayer = (players: CharType[]) => {
    const lowestHpChar = players.reduce((prev, next) =>
        next.stats.hitPoints < prev.stats.hitPoints ? next : prev
    );
    return [lowestHpChar.id];
};

function Enemy(props: CharType) {
    const { id, name, stats } = props;

    const game = useContext(GameContext);
    const activeTurn = game?.turnOrder[0] === id;
    const isSelected = game?.selectedEnemyIds.includes(id);
    
    useEffect(() => {
        if (activeTurn) {
            setTimeout(() => {
                turn({
                    gameId: game?.gameId,
                    maneuver: "slap",
                    targetIds: lowestHpPlayer(game.characters.filter((character) => character.team === "player")),
                    issuerId: id
                })
            }, 1500);
        }
    }, [activeTurn, game?.characters, game?.gameId, id]);

    return (
        <div className={`char-box enemy-box ${activeTurn && "active-enemy"} ${isSelected && "selected-enemy"}`}>
            <div className="name">
                {name}
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