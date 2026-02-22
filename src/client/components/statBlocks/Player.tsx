import "./StatBlocks.css";
import "./Player.css";
import { PlayerType } from "../../../types/individual/characters.ts";
import styled from "styled-components";
import { useGame } from "../../hooks/useGame.ts";

const HealthBar = styled.div<{ $percentHealth: number }>`
  height: 10px;
  width: 100%;
  background: ${(props) => {
    if (props.$percentHealth > 66) {
      return `linear-gradient(to right, rgb(43, 194, 83) ${props.$percentHealth}%, var(--black) ${props.$percentHealth}% ${100 - props.$percentHealth}%);`;
    } else if (props.$percentHealth > 33) {
      return `linear-gradient(to right #f1a165 ${props.$percentHealth}%, var(--black) ${props.$percentHealth}% ${100 - props.$percentHealth}%);`;
    } else {
      return `linear-gradient(to right #f0a3a3 ${props.$percentHealth}%, var(--black) ${props.$percentHealth}% ${100 - props.$percentHealth}%);`;
    }
  }};
`;

export default function Player(props: PlayerType & { id: string }) {
  const { id, name, stats } = props;
  const { game } = useGame();
  const activeTurn = game?.data.battle?.turnOrder[0] === id;

  return (
    <div className={`char-box player-box ${activeTurn && "active-char"}`}>
      <div className="id-bar">
        <HealthBar
          $percentHealth={(stats.life / stats.maxLife) * 100}
          className="health-bar"
        >
          {/*{stats.life} / {stats.maxLife}*/}
        </HealthBar>
        <div className="left special-font">{name}</div>
        <div className="left speed-display">
          {stats.speed} / {stats.maxSpeed}
        </div>
      </div>
    </div>
  );
}
