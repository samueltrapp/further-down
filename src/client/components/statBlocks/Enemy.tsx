import { useContext, useEffect } from "react";
import { BattleContext } from "../../contexts/BattleContext.tsx";
import "./StatBlocks.css";
import "./Enemy.css";
import { EnemyType } from "../../../types/individual/characters.ts";
import { enemyTurn } from "../../services/turn.ts";
import { LobbyContext } from "../../contexts/LobbyContext.tsx";

// const lowestHpPlayer = (players: PlayerType[]) => {
//   const lowestHpChar = players.reduce((prev, next) =>
//     next.stats.hitPoints < prev.stats.hitPoints ? next : prev,
//   );
//   return [lowestHpChar.id];
// };

function Enemy(props: EnemyType) {
  const { id, name, stats } = props;

  const battle = useContext(BattleContext);
  const lobby = useContext(LobbyContext);
  const activeTurn = battle?.turnOrder[0] === id;
  const isSelected = battle?.selectedEnemyIds.includes(id);

  useEffect(() => {
    if (activeTurn && lobby?.gameId) {
      setTimeout(() => {
        enemyTurn({
          gameId: lobby?.gameId,
          team: "enemy",
          issuerId: id,
        });
      }, 1500);
    }
  }, [activeTurn, lobby?.gameId, id]);

  return (
    <div
      className={`char-box enemy-box ${activeTurn && "active-enemy"} ${isSelected && "selected-enemy"}`}
    >
      <div className="name">{name}</div>
      <div>Hit Points: {stats?.hitPoints}</div>
      <div>Physical: {stats?.physical}</div>
      <div>Speed: {stats?.speed}</div>
    </div>
  );
}

export default Enemy;
