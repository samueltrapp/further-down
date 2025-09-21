import { ChangeEvent, MouseEvent, useContext } from "react";
import { ManeuverName } from "../../../types/equipables/maneuvers.ts";
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

export default function Player(props: PlayerType) {
  const { id, name, stats, rewards } = props;
  const { maneuvers, armors, weapons } = rewards.owned;
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);
  const activeTurn = game?.data.battle?.turnOrder[0] === id;
  const maxHp = Math.floor(armors[0].constitution * stats.vitality);

  const handleClickManeuver = (event: MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const value = target.value as ManeuverName;
    if (dispatch && target.value) {
      dispatch({
        type: GameAction.SELECT_MANEUVER,
        payload: {
          maneuverSelected: true,
          maxTargets: game?.client?.selectedManeuver?.maxTargets || 0,
          maneuver: value,
        },
      });
    }
  };

  const handleSelectWeapon = (event: ChangeEvent<HTMLSelectElement>) => {
    const target = event.target as HTMLSelectElement;
    const value = target.value as WeaponName;
    if (dispatch && target.value) {
      dispatch({
        type: GameAction.SELECT_WEAPON,
        payload: {
          weapon: value,
        },
      });
    }
  };

  return (
    <div className={`char-box player-box ${activeTurn && "active-char"}`}>
      <div className="id-bar">
        <div className="name">{name}</div>
        <HealthBar
          $percentHealth={stats.hitPoints / maxHp}
          className="health-bar"
        >
          <span>
            {stats.hitPoints} / {maxHp}
          </span>
        </HealthBar>
        <div className="speed-display">{stats.speed}</div>
      </div>
      <div className="stat-body">
        <div className="action-column">
          <select
            onChange={handleSelectWeapon}
            value={game?.client.selectedWeapon?.name}
          >
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
