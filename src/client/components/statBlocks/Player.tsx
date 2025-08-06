import { ChangeEvent, MouseEvent, useContext } from "react";
import { GameActions } from "../../../types/game.ts";
import { ManeuverName } from "../../../types/maneuvers.ts";
import {
  BattleContext,
  BattleDispatchContext,
} from "../../contexts/BattleContext.tsx";
import "./StatBlocks.css";
import "./Player.css";
import { mnvDetails } from "../../../server/turn/mnvDetails.ts";
import { PlayerType } from "../../../types/characters.ts";
import { toCaps } from "../../utils/formatting.ts";
import { WeaponName } from "../../../types/weapons.ts";
import styled from "styled-components";

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
  const { id, name, stats, knownManeuvers, ownedWeapons } = props;
  const battle = useContext(BattleContext);
  const battleDispatch = useContext(BattleDispatchContext);
  const activeTurn = battle?.turnOrder[0] === id;

  const handleClickManeuver = (event: MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const value = target.value as ManeuverName;
    if (battleDispatch && target.value) {
      battleDispatch({
        type: GameActions.SELECT_MANEUVER,
        payload: {
          maneuverSelected: true,
          maxTargets: mnvDetails[value].maxTargets,
          maneuver: value,
        },
      });
    }
  };

  const handleSelectWeapon = (event: ChangeEvent<HTMLSelectElement>) => {
    const target = event.target as HTMLSelectElement;
    const value = target.value as WeaponName;
    if (battleDispatch && target.value) {
      battleDispatch({
        type: GameActions.SELECT_WEAPON,
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
          $percentHealth={stats.hitPoints / stats.maxHitPoints}
          className="health-bar"
        >
          <span>
            {stats.hitPoints} / {stats.maxHitPoints}
          </span>
        </HealthBar>
        <div className="speed-display">{stats.speed}</div>
      </div>
      <div className="stat-body">
        <div className="action-column">
          <select onChange={handleSelectWeapon} value={battle?.selectedWeapon}>
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
              className={`maneuver-button ${activeTurn && battle?.selectedManeuver === knownManeuver ? "selected-maneuver" : ""}`}
              disabled={!activeTurn}
              key={knownManeuver}
              onClick={handleClickManeuver}
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
