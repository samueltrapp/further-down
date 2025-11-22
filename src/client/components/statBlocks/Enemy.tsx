import { useContext, useEffect } from "react";
import { EnemyType } from "../../../types/individual/characters.ts";
import { enemyTurn } from "../../services/turn.ts";
import "./StatBlocks.css";
import "./Enemy.css";
import { GameContext } from "../../contexts/GameContext.tsx";

function Enemy(props: EnemyType) {
  const { name, stats } = props;

  const game = useContext(GameContext);
  const client = game?.client;
  const lobby = game?.data.lobby;
  const activeTurn = game?.data.battle?.turnOrder[0] === id;
  const isSelected = client?.selectedEnemyIds.includes(id);

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
