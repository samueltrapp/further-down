import { EnemyType } from "../../../../types/individual/characters.ts";
import "./StatBlocks.css";
import "./Enemy.css";
import { useGame } from "../../../hooks/useGame.ts";
import StatBar from "../../_core/StatBar.tsx";
import { selectCharacters } from "../../../contexts/contextActions.ts";
import { GameAction } from "../../../contexts/ContextTypes.ts";
import { cdcl } from "../../../utils/formatting.ts";

export default function Enemy(
  props: EnemyType & { id: string; index: number },
) {
  const { id, name, stats, isDead } = props;

  const { game, dispatch } = useGame();
  const client = game?.client;
  const activeTurn = game?.data.battle?.turnOrder[0] === id;
  const isSelected = client?.selectedIds.includes(id);

  const handleClick = () => {
    if (dispatch && game?.client.selectedManeuver) {
      const updatedEnemyIds = selectCharacters(
        id,
        game?.client?.selectedIds,
        game?.client?.maxSelections,
      );
      dispatch({
        type: GameAction.PLAYER_ACTION,
        payload: {
          selectedIds: updatedEnemyIds,
        },
      });
    }
  };

  const handleMouseOver = () => {
    if (dispatch) {
      dispatch({
        type: GameAction.PLAYER_ACTION,
        payload: {
          enemyDetailsId: id,
        },
      });
    }
  };

  return (
    <button
      className={cdcl(
        "enemy-box",
        "id-bar",
        { "active-enemy": activeTurn },
        { "selected-enemy": isSelected },
        { "death-filter": isDead },
      )}
      onClick={handleClick}
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
      <div className="left-text special-font">{name}</div>
    </button>
  );
}
