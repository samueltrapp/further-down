import { MouseEvent, useContext } from "react";
import { GameActions } from "../../../types/game.ts";
import { ManeuverName } from "../../../types/maneuvers.ts";
import { GameContext, GameDispatchContext } from "../../contexts/GameContext";
import "./StatBlocks.css";
import { mnvDetails } from "../../../server/turn/mnvDetails.ts";
import { PlayerType } from "../../../types/characters.ts";
import { toCaps } from "../../utils/formatting.ts";

export default function Player(props: PlayerType) {
  const { id, name, stats, knownManeuvers, ownedWeapons } = props;
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
          maneuverSelected: true,
          maxTargets: mnvDetails[value].maxTargets,
          maneuver: value,
        },
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
          <select>
            {ownedWeapons.map((ownedWeapon) => (
              <option value={ownedWeapon.name}>
                {toCaps(ownedWeapon.name)}
              </option>
            ))}
          </select>
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
