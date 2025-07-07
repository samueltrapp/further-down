import {useContext} from "react";
import {GameContext, GameDispatchContext} from "../contexts/GameContext";
import Character from "../components/StatBlocks/Player";
import Enemy from "../components/StatBlocks/Enemy";
import "./GameBoard.css";
import {CharType, GameActions} from "../../types/game.ts";
import TurnTracker from "../components/Hud/TurnTracker.tsx";
import ConfirmButton from "../components/Hud/ConfirmButton.tsx";

function GameBoard() {
    const game = useContext(GameContext);
    const dispatch = useContext(GameDispatchContext);

    if (!game || !game.characters) return;
    const [players, enemies] = game.characters.reduce((characterArr, character) => {
        characterArr[character.team === "player" ? 0 : 1].push(character);
        return characterArr;
    }, [[] as CharType[], [] as CharType[]]);

    const handleSelect = (enemyId: string) => {
        if (dispatch && game.allowSelection) {
            dispatch({
                type: GameActions.SELECT_ENEMY,
                payload: enemyId
            });
        }
    }

    return (
        <>
            <TurnTracker/>
            <div className="board">
                <div className="player-column">
                    {players.map((player) => (
                        <div key={player.id}>
                            <Character {...player}/>
                        </div>
                    ))}
                </div>

                <div className="action-column">
                    <ConfirmButton/>
                </div>
                <div className="enemy-column">
                    {enemies.map((enemy) => (
                        <div
                            key={enemy.id}
                            onClick={() => handleSelect(enemy.id)}
                        >
                            <Enemy {...enemy}/>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default GameBoard;