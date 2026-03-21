import "./TurnMenu.css";
import { useTurnOrder } from "../../hooks/useTurnOrder.ts";
import { MouseEvent } from "react";
import { GameAction } from "../../contexts/ContextTypes.ts";
import { useGame } from "../../hooks/useGame.ts";
import { ManeuverName } from "../../../types/equipables/actions.ts";
import { EnemyType, PlayerType } from "../../../types/individual/characters.ts";
import { WeaponName } from "../../../types/equipables/weapons.ts";
import { weaponMap } from "../../../shared/definitions/weapons/sets.ts";
import { maneuverMap } from "../../../shared/definitions/maneuvers/sets.ts";
import { toCaps } from "../../utils/formatting.ts";
import { checkOwnership } from "../../utils/checkOwnership.ts";

function PersonalMenu({ character }: { character: PlayerType | EnemyType }) {
  const { game, dispatch } = useGame();
  const { maneuvers, weapons } = character.loadout;
  const isUserTurn = checkOwnership(character);
  const equippedWeapon = game?.client?.selectedWeapon;
  const filledManeuvers: (ManeuverName | "")[] =
    maneuvers.length < 6
      ? maneuvers.concat(new Array(6 - maneuvers.length).fill(""))
      : maneuvers;

  const handleClickManeuver = (event: MouseEvent<HTMLButtonElement>) => {
    const value = (event.target as HTMLButtonElement).value as ManeuverName;
    const selectedManeuver = maneuverMap.get(value);
    if (dispatch && value) {
      dispatch({
        type: GameAction.PLAYER_ACTION,
        payload: {
          selectedIds: [],
          selectionType: selectedManeuver?.targetMethod,
          selectedManeuver: value,
          maxSelections: selectedManeuver?.maxTargets || 0,
        },
      });
    }
  };

  const handleSelectWeapon = (event: MouseEvent<HTMLButtonElement>) => {
    const value = (event.target as HTMLButtonElement).value as WeaponName;
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
      <div className="weapon-toolbar">
        {weapons.map((weapon) => (
          <button
            className={`weapon-button ${equippedWeapon === weapon && "equipped-weapon"}`}
            onClick={handleSelectWeapon}
            value={weapon}
          >
            {toCaps(weapon)}
          </button>
        ))}
      </div>
      <div className="maneuver-track">
        {filledManeuvers.map((maneuver, id) => (
          <button
            className={`maneuver-button ${isUserTurn && game?.client.selectedManeuver === maneuver ? "selected-maneuver" : ""}`}
            disabled={!isUserTurn || maneuver === ""}
            key={maneuver || id}
            onClick={handleClickManeuver}
            value={maneuver}
          >
            {maneuver !== "" ? `${toCaps(maneuver)}` : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

function TurnMenu() {
  const character = useTurnOrder();

  return character ? (
    <div className="menu-container">
      <PersonalMenu character={character} />
    </div>
  ) : null;
}

export default TurnMenu;
