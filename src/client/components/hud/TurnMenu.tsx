import "./TurnMenu.css";
import { useTurnOrder } from "../../hooks/useTurnOrder.ts";
import { ChangeEvent, MouseEvent } from "react";
import { GameAction } from "../../contexts/ContextTypes.ts";
import { useGame } from "../../hooks/useGame.ts";
import { ManeuverName } from "../../../types/equipables/actions.ts";
import { PlayerType } from "../../../types/individual/characters.ts";
import { WeaponName } from "../../../types/equipables/weapons.ts";
import { weaponMap } from "../../../shared/definitions/weapons/sets.ts";
import { maneuverMap } from "../../../shared/definitions/maneuvers/sets.ts";
import { toCaps } from "../../utils/formatting.ts";
import { checkOwnership } from "../../utils/checkOwnership.ts";

function PersonalMenu({ character }: { character: PlayerType }) {
  const { game, dispatch } = useGame();
  const isUserTurn = checkOwnership(character);
  const { maneuvers, weapons } = character.rewards.owned;

  const handleClickManeuver = (event: MouseEvent<HTMLButtonElement>) => {
    const value = (event.target as HTMLButtonElement).value as ManeuverName;
    const selectedManeuver = maneuverMap.get(value);
    if (dispatch && value) {
      dispatch({
        type: GameAction.PLAYER_ACTION,
        payload: {
          selectedEnemyIds: [],
          selectedManeuver: value,
          maxEnemySelections: selectedManeuver?.maxTargets || 0,
        },
      });
    }
  };

  const handleSelectWeapon = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as WeaponName;
    const selectedWeapon = weaponMap.get(value)?.name || "";
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
    <div>
      <div className="action-column">
        <select
          onChange={handleSelectWeapon}
          value={game?.client.selectedWeapon}
        >
          {weapons.map((weapon) => (
            <option key={weapon} value={weapon}>
              {toCaps(weapon)}
            </option>
          ))}
        </select>
      </div>
      <div className="action-column">
        {maneuvers.map((maneuver) => (
          <button
            className={`maneuver-button ${isUserTurn && game?.client.selectedManeuver === maneuver ? "selected-maneuver" : ""}`}
            disabled={!isUserTurn}
            key={maneuver}
            onClick={handleClickManeuver}
            value={maneuver}
          >
            {`† ${maneuver.toUpperCase()}`}
          </button>
        ))}
      </div>
    </div>
  );
}

function TurnMenu() {
  const character = useTurnOrder();

  return (
    <div className="menu-container">
      {character?.team === "player" ? (
        <PersonalMenu character={character} />
      ) : null}
    </div>
  );
}

export default TurnMenu;
