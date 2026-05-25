import "./CharacterBlock.css";
import "./Player.css";
import {
  EnemyType,
  PlayerType,
} from "../../../../types/individual/characters.ts";
import { useGame } from "../../../hooks/useGame.ts";
import { GameAction } from "../../../contexts/ContextTypes.ts";
import { selectCharacters } from "../../../contexts/contextActions.ts";
import { cdcl } from "../../../utils/formatting.ts";
import StatBar from "../../_core/StatBar.tsx";

export default function CharacterBlock(
  props: (PlayerType | EnemyType) & { id: string; index: number },
) {
  const { id, index, name, stats, team } = props;
  const { game, dispatch } = useGame();
  const inspected =
    (team === "player"
      ? game?.client?.playerDetailsId
      : game?.client?.enemyDetailsId) === id;
  const selected = game?.client?.selectedIds.includes(id);

  const handleInspectClick = () => {
    if (!dispatch) return;

    const updatedDetails =
      team === "player" ? { playerDetailsId: id } : { enemyDetailsId: id };
    dispatch({
      type: GameAction.PLAYER_ACTION,
      payload: updatedDetails,
    });
  };

  const handleSelectClick = () => {
    if (!dispatch || !game?.client.selectedManeuver) return;

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
  };

  return (
    <div
      className={`df ${team === "player" ? "fdr" : "fdrr"} w100 ${team}-grid-${index}`}
    >
      <button
        className={cdcl("char-btn", { "char-ins-btn-active": inspected })}
        onClick={handleInspectClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </button>
      <div className="char-bar">
        <StatBar
          id={id}
          maxStat={stats.maxLife}
          currentStat={stats.life}
          stat="life"
        >
          {name}
        </StatBar>
      </div>
      <button
        className={cdcl("char-btn", { "char-sel-btn-active": selected })}
        onClick={handleSelectClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M8 0a.5.5 0 0 1 .5.5v.518A7 7 0 0 1 14.982 7.5h.518a.5.5 0 0 1 0 1h-.518A7 7 0 0 1 8.5 14.982v.518a.5.5 0 0 1-1 0v-.518A7 7 0 0 1 1.018 8.5H.5a.5.5 0 0 1 0-1h.518A7 7 0 0 1 7.5 1.018V.5A.5.5 0 0 1 8 0m-.5 2.02A6 6 0 0 0 2.02 7.5h1.005A5 5 0 0 1 7.5 3.025zm1 1.005A5 5 0 0 1 12.975 7.5h1.005A6 6 0 0 0 8.5 2.02zM12.975 8.5A5 5 0 0 1 8.5 12.975v1.005a6 6 0 0 0 5.48-5.48zM7.5 12.975A5 5 0 0 1 3.025 8.5H2.02a6 6 0 0 0 5.48 5.48zM10 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0" />
        </svg>
      </button>
    </div>
  );
}
