import { EnemyType } from "../../../types/individual/characters.ts";
import "./StatBlocks.css";
import "./Enemy.css";
import { useGame } from "../../hooks/useGame.ts";
import { HealthBar } from "../core/HealthBar.tsx";

function Enemy(props: EnemyType & { id: string }) {
  const { id, name, stats } = props;

  const { game } = useGame();
  const client = game?.client;
  const activeTurn = game?.data.battle?.turnOrder[0] === id;
  const isSelected = client?.selectedIds.includes(id);

  return (
    <div
      className={`char-box enemy-box ${activeTurn ? "active-enemy" : ""} ${isSelected ? "selected-enemy" : ""}`}
    >
      <HealthBar
        $percentHealth={(stats.life / stats.maxLife) * 100}
        className="health-bar"
      >
        {/*{stats.life} / {stats.maxLife}*/}
      </HealthBar>
      <div className="left-text special-font">{name}</div>
      <div className="left-text speed-display">
        {stats?.speed} / {stats?.maxSpeed}
      </div>
    </div>
  );
}

export default Enemy;
