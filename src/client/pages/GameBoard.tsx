import { MouseEvent, useContext } from "react";
import { GameContext, GameDispatchContext } from "../contexts/GameContext";
// import { readCharacters } from "../utils/data";
import Character from "../components/StatBlocks/Player";
import Enemy from "../components/StatBlocks/Enemy";
import "./GameBoard.css";
import { CharType, GameActions } from "../../types";

function GameBoard() {
  const game = useContext(GameContext);
  //const dispatch = useContext(GameDispatchContext);

  if (!game || !game.characters) return;
  console.log(game.turnOrder);
  //console.log(game.characters.find((character) => character.id === game.currentTurn)?.stats.speed);
  const [players, enemies] = game.characters.reduce((characterArr, character) => {
    characterArr[character.team === "player" ? 0 : 1].push(character);
    return characterArr;
  }, [ [] as CharType[], [] as CharType[] ]);

  // function handleSelect(evt: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, id: string) {
  //   evt.preventDefault();
  //   const checkedId = game?.selectedEnemyIds.includes(id) ? id : "";
    
  //   if (dispatch) {
  //     dispatch({
  //       type: GameActions.SELECT,
  //       payload: checkedId
  //     });
  //   }
  // }

  return (
    <div className="board">
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