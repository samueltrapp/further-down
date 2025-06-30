import { useState, MouseEvent, useContext } from "react";
import { GameContext, GameDispatchContext } from "../contexts/GameContext";
// import { readCharacters } from "../utils/data";
import Character from "../components/StatBlocks/Player";
import Enemy from "../components/StatBlocks/Enemy";
import "./GameBoard.css";
import { GameActions } from "../../types";

function GameBoard() {
  const [playerTurnId, setPlayerTurnId] = useState("");
  const state = useContext(GameContext);
  const dispatcher = useContext(GameDispatchContext);

  if (!state || !state.characters) return;
  // const { players, enemies } = state.characters;
  const players = state.characters.slice(0, 3);
  const enemies = state.characters.slice(3);

  function handleSelect(evt: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, id: string) {
    evt.preventDefault();
    const checkedId = state?.selectedEnemyId !== id ? id : "";
    dispatcher({
      type: GameActions.SELECT,
      payload: checkedId
    });
  }

  return (
    <div className="board">
      <div className="board-grid board-gap">
        {enemies.map((enemy) => (
          <div key={enemy.id} onClick={(evt) => handleSelect(evt, enemy.id)}>
            <Enemy id={enemy.id} enemy={enemy.stats} selected={enemy.id === state.selectedEnemyId} />
          </div>
        ))}
      </div>
      <div className="board-grid">
        {players.map((player) => (
          <div key={player.id}>
            <Character id={player.id} player={player.stats} isUp={player.id === playerTurnId} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;