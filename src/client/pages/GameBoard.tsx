import { useState, MouseEvent } from "react";
import { GameState } from "../../types";
import Character from "../components/Character";
import Enemy from "../components/Enemy";
import "./GameBoard.css";

function GameBoard({gameState}: {gameState: GameState}) {
  const [selectedEnemyId, setSelectedEnemyId] = useState("");
  const [playerTurnId, setPlayerTurnId] = useState("");

  if (gameState === null) return;

  const { characters, enemies } = gameState;

  function handleSelect(evt: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, id: string) {
    evt.preventDefault();
    setSelectedEnemyId(id !== selectedEnemyId ? id : "");
  }

  return (
    <div className="board">
      <div className="board-grid board-gap">
        {enemies.map((enemy) => (
          <div onClick={(evt) => handleSelect(evt, enemy.id)}>
            <Enemy key={enemy.id} enemy={enemy} selected={enemy.id === selectedEnemyId} />
          </div>
        ))}
      </div>
      <div className="board-grid">
        {characters.map((character) => (
          <div className="char-stat-container">
            <Character key={character.id} character={character} isUp={character.id === playerTurnId} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;