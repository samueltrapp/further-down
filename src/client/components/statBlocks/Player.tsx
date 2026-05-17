import "./StatBlocks.css";
import "./Player.css";
import { PlayerType } from "../../../types/individual/characters.ts";
import { useGame } from "../../hooks/useGame.ts";
import StatBar from "../_core/StatBar.tsx";
import { GameAction } from "../../contexts/ContextTypes.ts";
import { cdcl } from "../../utils/formatting.ts";

export default function Player(
  props: PlayerType & { id: string; index: number },
) {
  const { id, name, stats } = props;
  const { game, dispatch } = useGame();
  const activeTurn = game?.data.battle?.turnOrder[0] === id;

  const handleMouseOver = () => {
    if (dispatch) {
      dispatch({
        type: GameAction.PLAYER_ACTION,
        payload: {
          detailId: id,
        },
      });
    }
  };

  return (
    <button
      className={cdcl("char-box", "player-box", "id-bar", {
        "active-char": activeTurn,
      })}
      onMouseOver={handleMouseOver}
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
