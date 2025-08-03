import { useContext, useEffect } from "react";
import { BattleContext } from "../../contexts/BattleContext.tsx";
import "./StatBlocks.css";
import "./Enemy.css";
import { EnemyType } from "../../../types/characters.ts";
import { enemyTurn } from "../../utils/turn.ts";

// const lowestHpPlayer = (players: PlayerType[]) => {
//   const lowestHpChar = players.reduce((prev, next) =>
//     next.stats.hitPoints < prev.stats.hitPoints ? next : prev,
//   );
//   return [lowestHpChar.id];
// };

function Enemy(props: EnemyType) {
  const { id, name, stats } = props;

  const game = useContext(BattleContext);
  const activeTurn = game?.turnOrder[0] === id;
  const isSelected = game?.selectedEnemyIds.includes(id);

  useEffect(() => {
    if (activeTurn) {
      setTimeout(() => {
        enemyTurn({
          gameId: game?.gameId,
          team: "enemy",
          issuerId: id,
        });
      }, 1500);
    }
  }, [activeTurn, game?.characters, game?.gameId, id]);

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
