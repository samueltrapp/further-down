import { useContext } from "react";
import {
  BattleContext,
  BattleDispatchContext,
} from "../../contexts/BattleContext.tsx";
import { playerTurn } from "../../utils/turn.ts";
import { GameActions } from "../../../types/game.ts";
import { ManeuverName } from "../../../types/maneuvers.ts";
import { WeaponName } from "../../../types/weapons.ts";
import { LobbyContext } from "../../contexts/LobbyContext.tsx";

export default function ConfirmButton() {
  const battle = useContext(BattleContext);
  const lobby = useContext(LobbyContext);
  const dispatch = useContext(BattleDispatchContext);
  const currentTurn = battle?.turnOrder[0];

  return battle &&
    battle.enableConfirmation &&
    battle.selectedManeuver &&
    battle.selectedWeapon &&
    battle.selectedEnemyIds &&
    currentTurn &&
    lobby?.gameId ? (
    <button
      className="confirm-button"
      onClick={() => {
        playerTurn({
          maneuver: battle.selectedManeuver as ManeuverName,
          weapon: battle?.selectedWeapon as WeaponName,
          team: "player",
          gameId: lobby.gameId,
          targetIds: battle.selectedEnemyIds,
          issuerId: currentTurn,
        });
        if (dispatch) {
          dispatch({ type: GameActions.SELECT_ENEMY, payload: null });
          dispatch({
            type: GameActions.SELECT_MANEUVER,
            payload: {
              maneuverSelected: false,
              maxTargets: 0,
              maneuver: undefined,
            },
          });
        }
      }}
    >
      Confirm
    </button>
  ) : null;
}
