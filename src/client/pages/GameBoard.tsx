import { MouseEvent, useContext } from "react";
import { GameContext, GameDispatchContext } from "../contexts/GameContext";
// import { readCharacters } from "../utils/data";
import Character from "../components/StatBlocks/Player";
import Enemy from "../components/StatBlocks/Enemy";
import "./GameBoard.css";
import { GameActions } from "../../types";

function GameBoard() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);

  if (!game || !game.characters) return;
  // const { players, enemies } = state.characters;
  const players = game.characters.slice(0, 3);
  const enemies = game.characters.slice(3);

  function handleSelect(evt: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, id: string) {
    evt.preventDefault();
    const checkedId = game?.selectedEnemyId !== id ? id : "";
    
    if (dispatch) {
      dispatch({
        type: GameActions.SELECT,
        payload: checkedId
      });
    }
  }

  return (
    <div className="board">
      <div className="board-grid board-gap">
        {enemies.map((enemy) => (
          <div key={enemy.id} onClick={(evt) => handleSelect(evt, enemy.id)}>
            <Enemy id={enemy.id} enemy={enemy.stats} selected={enemy.id === game.selectedEnemyId} />
          </div>
        ))}
      </div>
      <div className="board-grid">
        {players.map((player) => (
          <div key={player.id}>
            <Character id={player.id} player={player.stats} isUp={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;