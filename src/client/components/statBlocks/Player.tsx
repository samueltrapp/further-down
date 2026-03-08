import "./StatBlocks.css";
import "./Player.css";
import { PlayerType } from "../../../types/individual/characters.ts";
import { useGame } from "../../hooks/useGame.ts";
import { HealthBar } from "../core/HealthBar.tsx";

export default function Player(props: PlayerType & { id: string }) {
  const { id, name, stats } = props;
  const { game } = useGame();
  const activeTurn = game?.data.battle?.turnOrder[0] === id;

  return (
    <div className={`char-box player-box ${activeTurn ? "active-char" : ""}`}>
      <div className="id-bar">
        <HealthBar
          $percentHealth={(stats.life / stats.maxLife) * 100}
          className="health-bar"
        >
          {/*{stats.life} / {stats.maxLife}*/}
        </HealthBar>
        <div className="right-text special-font">{name}</div>
        <div className="right-text speed-display">
          {stats.speed} / {stats.maxSpeed}
        </div>
      </div>
    </div>
  );
}
