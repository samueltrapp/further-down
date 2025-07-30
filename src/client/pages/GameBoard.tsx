import { useContext } from "react";
import { GameContext, GameDispatchContext } from "../contexts/GameContext";
import Character from "../components/statBlocks/Player";
import Enemy from "../components/statBlocks/Enemy";
import "./GameBoard.css";
import { GameActions } from "../../types/game.ts";
import TurnTracker from "../components/hud/TurnTracker.tsx";
import ConfirmButton from "../components/hud/ConfirmButton.tsx";
import BattleLog from "../components/hud/BattleLog.tsx";
import Advisor from "../components/hud/Advisor.tsx";
import { EnemyType, PlayerType } from "../../types/characters.ts";

function GameBoard() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);

  if (!game || !game.characters) return;
  const [players, enemies] = game.characters.reduce(
    (characterArr, character) => {
      // @ts-ignore
      characterArr[character.team === "player" ? 0 : 1].push(character);
      return characterArr;
    },
    [[] as PlayerType[], [] as EnemyType[]],
  );

  const handleSelect = (enemyId: string) => {
    if (dispatch && game.enableConfirmation) {
      dispatch({
        type: GameActions.SELECT_ENEMY,
        payload: enemyId,
      });
    }
  };

  return (
    <>
      <TurnTracker />
      <div className="board">
        <div className="filler-column" />
        <div className="player-column">
          {players.map((player) => (
            <div key={player.id}>
              <Character {...player} />
            </div>
          ))}
        </div>

        <div className="hub-column">
          <Advisor />
          <BattleLog />
          <ConfirmButton />
        </div>
        <div className="enemy-column">
          {enemies.map((enemy) => (
            <div key={enemy.id} onClick={() => handleSelect(enemy.id)}>
              <Enemy {...enemy} />
            </div>
          ))}
        </div>
        <div className="filler-column" />
      </div>
    </>
  );
}

export default GameBoard;
