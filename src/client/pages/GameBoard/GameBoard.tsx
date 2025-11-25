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
import { selectEnemies } from "../../contexts/contextActions.ts";

function GameBoard() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);
  const battle = game?.data.battle;
  const characters = game?.data.characters;

  if (!battle || !characters) return;
  const { players, enemies } = characters;

  const handleSelect = (enemyId: string) => {
    if (dispatch && game.client.selectedManeuver) {
      const updatedEnemyIds = selectEnemies(
        enemyId,
        game?.client?.selectedEnemyIds,
        game?.client?.maxEnemySelections,
      );
      dispatch({
        type: GameAction.PLAYER_ACTION,
        payload: {
          selectedEnemyIds: updatedEnemyIds,
        },
      });
    }
  };

  return (
    <>
      <TurnTracker />
      <div className="board">
        <div className="filler-column" />
        <div className="player-column">
          {Object.entries(players).map((player) => (
            <div key={player[0]}>
              <Character id={player[0]} {...player[1]} />
            </div>
          ))}
        </div>

        <div className="hub-column">
          <Advisor />
          <BattleLog />
          <ConfirmButton />
        </div>
        <div className="enemy-column">
          {Object.entries(enemies).map((enemy) => (
            <div key={enemy[0]} onClick={() => handleSelect(enemy[0])}>
              <Enemy id={enemy[0]} {...enemy[1]} />
            </div>
          ))}
        </div>
        <div className="filler-column" />
      </div>
    </>
  );
}

export default GameBoard;
