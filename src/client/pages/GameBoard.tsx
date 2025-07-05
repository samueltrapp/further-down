import {useContext} from "react";
import {GameContext} from "../contexts/GameContext";
import Character from "../components/StatBlocks/Player";
import Enemy from "../components/StatBlocks/Enemy";
import "./GameBoard.css";
import {CharType} from "../../types/game.ts";
import TurnTracker from "../components/Hud/TurnTracker.tsx";

function GameBoard() {
    const game = useContext(GameContext);

    if (!game || !game.characters) return;
    const [players, enemies] = game.characters.reduce((characterArr, character) => {
        characterArr[character.team === "player" ? 0 : 1].push(character);
        return characterArr;
    }, [[] as CharType[], [] as CharType[]]);

    return (
        <div className="board">
            <TurnTracker />
            <div className="board-grid board-gap">
                {enemies.map((enemy) => (
                    <div
                        key={enemy.id}
                        // onClick={(evt) => handleSelect(evt, enemy.id)}
                    >
                        <Enemy {...enemy}/>
                    </div>
                ))}
            </div>
            <div className="board-grid">
                {players.map((player) => (
                    <div key={player.id}>
                        <Character {...player}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GameBoard;