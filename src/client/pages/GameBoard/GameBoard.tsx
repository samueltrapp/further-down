import Player from "../../components/battle/StatBlocks/Player.tsx";
import Enemy from "../../components/battle/StatBlocks/Enemy.tsx";
import "./GameBoard.css";
import ConfirmButton from "../../components/battle/ConfirmButton/ConfirmButton.tsx";
import BattleLog from "../../components/battle/BattleLog/BattleLog.tsx";
import { EnemyType, PlayerType } from "../../../types/individual/characters.ts";
import TurnMenu from "../../components/battle/TurnMenu/TurnMenu.tsx";
import { useGame } from "../../hooks/useGame.ts";
import TurnTracker from "../../components/battle/TurnTracker/TurnTracker.tsx";
import DetailsPanel from "../../components/battle/DetailsPanel/DetailsPanel.tsx";

function GameBoard() {
  const { game } = useGame();
  const battle = game?.data.battle;
  const characters = game?.data.characters;
  const inspectedPlayerId = game?.client?.playerDetailsId;
  const inspectedEnemyId = game?.client?.enemyDetailsId;
  const inspectedPlayer =
    inspectedPlayerId && characters ? characters[inspectedPlayerId] : null;
  const inspectedEnemy =
    inspectedEnemyId && characters ? characters[inspectedEnemyId] : null;

  if (!battle || !characters) return;
  const splitChars: { players: PlayerType[]; enemies: EnemyType[] } = {
    players: [],
    enemies: [],
  };

  Object.entries(characters).reduce((arrays, curr) => {
    if (curr[1].team === "player") {
      arrays.players.push(curr[1] as PlayerType);
    } else {
      arrays.enemies.push(curr[1] as EnemyType);
    }
    return arrays;
  }, splitChars);

  return (
    <>
      <TurnTracker />
      <div className="container">
        <div className="board-grid">
          <DetailsPanel character={inspectedPlayer} />
          <div className="char-grid">
            {Object.values(splitChars.players).map((player, index) => (
              <Player key={player.id} index={index} {...player} />
            ))}
          </div>
          <div className="hub-column">
            <div className="inner-hub">
              <TurnMenu />
              <ConfirmButton />
              <BattleLog />
            </div>
          </div>
          <div className="char-grid">
            {Object.values(splitChars.enemies).map((enemy, index) => (
              <Enemy key={enemy.id} index={index} {...enemy} />
            ))}
          </div>
          <DetailsPanel character={inspectedEnemy} />
        </div>
      </div>
    </>
  );
}

export default GameBoard;
