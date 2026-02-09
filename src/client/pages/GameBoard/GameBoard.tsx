import { useContext } from "react";
import Player from "../../components/statBlocks/Player.tsx";
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
import { EnemyType, PlayerType } from "../../../types/individual/characters.ts";
import GraphicsCanvas from "../../components/hud/GraphicsCanvas.tsx";

function GameBoard() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);
  const battle = game?.data.battle;
  const characters = game?.data.characters;

  if (!battle || !characters) return;
  const splitChars: { players: PlayerType[]; enemies: EnemyType[] } = {
    players: [],
    enemies: [],
  };
  Array.from(characters).reduce((arrs, curr) => {
    if (curr[1].team === "player") {
      arrs.players.push(curr[1] as PlayerType);
    } else {
      arrs.enemies.push(curr[1] as EnemyType);
    }
    return arrs;
  }, splitChars);

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
          {Object.values(splitChars.players).map((player) => (
            <div key={player.id}>
              <Player {...player} />
            </div>
          ))}
        </div>

        <div className="hub-column">
          <Advisor />
          <GraphicsCanvas />
          <ConfirmButton />
          <BattleLog />
        </div>
        <div className="enemy-column">
          {Object.values(splitChars.enemies).map((enemy) => (
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
