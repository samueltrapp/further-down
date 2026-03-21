import { playerTurn } from "../../services/turn.ts";
import { ManeuverName } from "../../../types/equipables/actions.ts";
import { WeaponName } from "../../../types/equipables/weapons.ts";
import { useGame } from "../../hooks/useGame.ts";
import { useTurnOrder } from "../../hooks/useTurnOrder.ts";
import { checkOwnership } from "../../utils/checkOwnership.ts";
import "./ConfirmButton.css";

export default function ConfirmButton() {
  const { game } = useGame();
  const character = useTurnOrder();
  const isUserTurn = checkOwnership(character);
  const client = game?.client;
  const lobby = game?.data.lobby;
  const satisfiesSelection =
    client?.selectionType === "select" ? client?.selectedIds.length > 0 : true;

  const enabled = !!(
    lobby?.gameId &&
    client?.selectedManeuver &&
    client?.selectedWeapon &&
    satisfiesSelection &&
    character &&
    isUserTurn
  );

  function handleConfirm() {
    if (!enabled) return;
    playerTurn({
      maneuver: client.selectedManeuver as ManeuverName,
      weapon: client.selectedWeapon as WeaponName,
      team: "player",
      gameId: lobby.gameId,
      targetIds: client.selectedIds,
      sourceId: character.id,
    });
  }

  return (
    <button
      className="confirm-button"
      disabled={!enabled}
      onClick={handleConfirm}
    >
      Confirm
    </button>
  );
}
