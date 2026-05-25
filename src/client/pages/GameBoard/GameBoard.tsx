import "./GameBoard.css";
import ConfirmButton from "../../components/battle/ConfirmButton/ConfirmButton.tsx";
import BattleLog from "../../components/battle/BattleLog/BattleLog.tsx";
import { EnemyType, PlayerType } from "../../../types/individual/characters.ts";
import TurnMenu from "../../components/battle/TurnMenu/TurnMenu.tsx";
import { useGame } from "../../hooks/useGame.ts";
import TurnTracker from "../../components/battle/TurnTracker/TurnTracker.tsx";
import DetailsPanel from "../../components/battle/DetailsPanel/DetailsPanel.tsx";
import CharacterMenu from "../../components/battle/StatBlocks/CharacterMenu.tsx";

function GameBoard() {
  const { game } = useGame();
  const battle = game?.data.battle;
  const characters = game?.data.characters;
  const inspectedPlayerId = game?.client?.playerDetailsId;
  const inspectedEnemyId = game?.client?.enemyDetailsId;
  const inspectedPlayer =
    inspectedPlayerId && characters ? characters[inspectedPlayerId] : null;
  const inspectedEnemy =
    inspectedEnemyId && characters ? characters[inspectedEnemyId] : null;

  if (!battle || !characters) return;
  const splitChars: { players: PlayerType[]; enemies: EnemyType[] } = {
    players: [],
    enemies: [],
  };

  Object.entries(characters).reduce((arrays, curr) => {
    if (curr[1].team === "player") {
      arrays.players.push(curr[1] as PlayerType);
    } else {
      arrays.enemies.push(curr[1] as EnemyType);
    }
    return arrays;
  }, splitChars);

  return (
    <>
      <TurnTracker />
      <div className="container board-grid">
        <DetailsPanel character={inspectedPlayer} />
        <div className="control-hub">
          <CharacterMenu
            players={splitChars.players}
            enemies={splitChars.enemies}
          />
          <TurnMenu />
          <ConfirmButton />
          <BattleLog />
        </div>
        <DetailsPanel character={inspectedEnemy} />
      </div>
    </>
  );
}

export default GameBoard;
