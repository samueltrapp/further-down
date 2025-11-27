import { ChangeEvent, MouseEvent, useContext } from "react";
import { ManeuverName } from "../../../types/equipables/actions.ts";
import "./StatBlocks.css";
import "./Player.css";
import { PlayerType } from "../../../types/individual/characters.ts";
import { toCaps } from "../../utils/formatting.ts";
import { WeaponName } from "../../../types/equipables/weapons.ts";
import styled from "styled-components";
import {
  GameContext,
  GameDispatchContext,
} from "../../contexts/GameContext.tsx";
import { GameAction } from "../../contexts/ContextTypes.ts";

const HealthBar = styled.div<{ $percentHealth: number }>`
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

export default function Player(props: PlayerType & { id: string }) {
  const { id, name, stats, rewards } = props;
  const { maneuvers, weapons } = rewards.owned;
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);
  const activeTurn = game?.data.battle?.turnOrder[0] === id;

  const handleClickManeuver = (event: MouseEvent<HTMLButtonElement>) => {
    const value = (event.target as HTMLButtonElement).value as ManeuverName;
    const selectedManeuver = game?.data.lib.maneuvers.find(
      (maneuver) => maneuver.name === value,
    );
    if (dispatch && value) {
      dispatch({
        type: GameAction.PLAYER_ACTION,
        payload: {
          selectedEnemyIds: [],
          selectedManeuver,
          maxEnemySelections: selectedManeuver?.maxTargets || 0,
        },
      });
    }
  };

  const handleSelectWeapon = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as WeaponName;
    const selectedWeapon = game?.data.lib.weapons.find(
      (weapon) => weapon.name === value,
    );
    if (dispatch && value) {
      dispatch({
        type: GameAction.PLAYER_ACTION,
        payload: {
          selectedWeapon: selectedWeapon,
        },
      });
    }
  };

  return (
    <div className={`char-box player-box ${activeTurn && "active-char"}`}>
      <div className="id-bar">
        <div className="name">{name}</div>
        <HealthBar
          $percentHealth={stats.life / stats.maxLife}
          className="health-bar"
        >
          <span>
            {stats.life} / {stats.maxLife}
          </span>
        </HealthBar>
        <div className="speed-display">
          {stats.speed} / {stats.maxSpeed}
        </div>
      </div>
      <div className="stat-body">
        <div className="action-column">
          <select
            onChange={handleSelectWeapon}
            value={game?.client.selectedWeapon?.name}
          >
            {game?.client.selectedWeapon === null && (
              <option key="unarmed" value={""}>
                Unarmed
              </option>
            )}
            {weapons.map((weapon) => (
              <option key={id} value={weapon.name}>
                {toCaps(weapon.name)}
              </option>
            ))}
          </select>
        </div>
        <div className="action-column">
          {maneuvers.map((maneuver) => (
            <button
              className={`maneuver-button ${activeTurn && game?.client.selectedManeuver?.name === maneuver.name ? "selected-maneuver" : ""}`}
              disabled={!activeTurn}
              key={maneuver.name}
              onClick={handleClickManeuver}
              value={maneuver.name}
            >
              {`> ${maneuver.name.toUpperCase()}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
