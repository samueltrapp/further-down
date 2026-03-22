import "./StatBlocks.css";
import "./Player.css";
import { PlayerType } from "../../../types/individual/characters.ts";
import { useGame } from "../../hooks/useGame.ts";
import StatBar from "../core/StatBar.tsx";

export default function Player(
  props: PlayerType & { id: string; index: number },
) {
  const { id, name, stats } = props;
  const { game } = useGame();
  const activeTurn = game?.data.battle?.turnOrder[0] === id;

  return (
    <button
      className={`char-box player-box id-bar left-row-${props.index} ${activeTurn ? "active-char" : ""}`}
    >
      <StatBar
        id={id}
        stat="life"
        maxStat={stats.maxLife}
        currentStat={stats.life}
      />
      <StatBar
        id={id}
        stat="speed"
        maxStat={stats.maxSpeed}
        currentStat={stats.speed}
      />
      <div className="right-text special-font">{name}</div>
    </button>
  );
}
