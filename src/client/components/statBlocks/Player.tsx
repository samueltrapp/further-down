import { MouseEvent, useContext } from "react";
import { GameActions } from "../../../types/game.ts";
import { ManeuverName } from "../../../types/maneuvers.ts";
import { GameContext, GameDispatchContext } from "../../contexts/GameContext";
import "./StatBlocks.css";
import { mnvDetails } from "../../../server/turn/mnvDetails.ts";
import { TechniqueName } from "../../../types/techniques.ts";
import { PlayerType } from "../../../types/characters.ts";

export default function Player(props: PlayerType) {
  const { id, name, stats, knownManeuvers, knownTechniques } = props;
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);
  const activeTurn = game?.turnOrder[0] === id;

  const handleManeuver = (event: MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const value = target.value as ManeuverName;
    if (dispatch && target.value) {
      dispatch({
        type: GameActions.SELECT_MANEUVER,
        payload: {
          allowManeuverSelect: true,
          maxTargets: mnvDetails[value].maxTargets,
          maneuver: value,
        },
      });
    }
  };

  const handleTechnique = (event: MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const value = target.value as TechniqueName;
    if (dispatch && target.value) {
      dispatch({
        type: GameActions.SELECT_TECHNIQUE,
        payload: { allowTechniqueSelect: true, technique: value },
      });
    }
  };

  return (
    <div className={`char-box player-box ${activeTurn && "active-char"}`}>
      <div className="id-bar">
        <div className="hp-display">{stats.hitPoints}</div>
        <div className="name">{name}</div>
        <div className="speed-display">{stats.speed}</div>
      </div>

      <div className="stat-body">
        <div className="action-column">
          <button
            className={`technique-button ${activeTurn && game?.selectedTechnique === "none" ? "selected-technique" : ""}`}
            disabled={!activeTurn}
            key="none"
            onClick={handleTechnique}
            value="none"
          >
            {`+ NONE`}
          </button>
          {knownTechniques.map((knownTechnique) => (
            <button
              className={`technique-button ${activeTurn && game?.selectedTechnique === knownTechnique ? "selected-technique" : ""}`}
              disabled={!activeTurn}
              key={knownTechnique}
              onClick={handleTechnique}
              value={knownTechnique}
            >
              {`+ ${knownTechnique.toUpperCase()}`}
            </button>
          ))}
        </div>
        <div className="action-column">
          {knownManeuvers.map((knownManeuver) => (
            <button
              className={`maneuver-button ${activeTurn && game?.selectedManeuver === knownManeuver ? "selected-maneuver" : ""}`}
              disabled={!activeTurn}
              key={knownManeuver}
              onClick={handleManeuver}
              value={knownManeuver}
            >
              {`> ${knownManeuver.toUpperCase()}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
