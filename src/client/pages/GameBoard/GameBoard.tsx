import { useContext } from "react";
import Character from "../../components/statBlocks/Player.tsx";
import Enemy from "../../components/statBlocks/Enemy.tsx";
import "./GameBoard.css";
import TurnTracker from "../../components/hud/TurnTracker.tsx";
import ConfirmButton from "../../components/hud/ConfirmButton.tsx";
import BattleLog from "../../components/hud/BattleLog.tsx";
import Advisor from "../../components/hud/Advisor.tsx";
import {
  GameContext,
  GameDispatchContext,
} from "../../contexts/GameContext.tsx";
import { GameAction } from "../../contexts/ContextTypes.ts";

function GameBoard() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);
  const battle = game?.data.battle;
  const characters = game?.data.characters;

  if (!battle || !characters) return;
  const { players, enemies } = characters;

  const handleSelect = (enemyId: string) => {
    if (dispatch && game?.client.enableConfirmation) {
      dispatch({
        type: GameAction.SELECT_ENEMY,
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
