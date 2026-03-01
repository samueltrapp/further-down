import { EnemyType } from "../../../types/individual/characters.ts";
import "./StatBlocks.css";
import "./Enemy.css";
import styled from "styled-components";
import { useGame } from "../../hooks/useGame.ts";

const HealthBar = styled.div<{ $percentHealth: number }>`
  height: 10px;
  width: ${(props) => `${props.$percentHealth * 100}%`};
  background-color: ${(props) => {
    if (props.$percentHealth > 0.66) {
      return "rgb(43, 194, 83);";
    } else if (props.$percentHealth > 0.33) {
      return "#f1a165;";
    } else {
      return "#f0a3a3;";
    }
  }};
`;

function Enemy(props: EnemyType & { id: string }) {
  const { id, name, stats } = props;

  const { game } = useGame();
  const client = game?.client;
  const activeTurn = game?.data.battle?.turnOrder[0] === id;
  const isSelected = client?.selectedEnemyIds.includes(id);

  return (
    <div
      className={`char-box enemy-box ${activeTurn && "active-enemy"} ${isSelected && "selected-enemy"}`}
    >
      <HealthBar
        $percentHealth={stats.life / stats.maxLife}
        className="health-bar"
      >
        {/*{stats.life} / {stats.maxLife}*/}
      </HealthBar>
      <div className="name">{name}</div>
      <div>
        {stats?.speed} / {stats?.maxSpeed}
      </div>
    </div>
  );
}

export default Enemy;
