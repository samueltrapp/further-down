import Player from "../../components/statBlocks/Player.tsx";
import Enemy from "../../components/statBlocks/Enemy.tsx";
import "./GameBoard.css";
import ConfirmButton from "../../components/hud/ConfirmButton.tsx";
import BattleLog from "../../components/hud/BattleLog.tsx";
import { EnemyType, PlayerType } from "../../../types/individual/characters.ts";
import GraphicsCanvas from "../../components/hud/GraphicsCanvas.tsx";
import TurnMenu from "../../components/hud/TurnMenu.tsx";
import { useGame } from "../../hooks/useGame.ts";
import TurnTracker from "../../components/hud/TurnTracker.tsx";

function GameBoard() {
  const { game } = useGame();
  const battle = game?.data.battle;
  const characters = game?.data.characters;

  if (!battle || !characters) return;
  const splitChars: { players: PlayerType[]; enemies: EnemyType[] } = {
    players: [],
    enemies: [],
  };

  Object.entries(characters).reduce((arrs, curr) => {
    if (curr[1].team === "player") {
      arrs.players.push(curr[1] as PlayerType);
    } else {
      arrs.enemies.push(curr[1] as EnemyType);
    }
    return arrs;
  }, splitChars);

  return (
    <>
      <TurnTracker />
      <div className="board-grid">
        <div className="left-spacer" />
        {Object.values(splitChars.players).map((player, index) => (
          <Player key={player.id} index={index} {...player} />
        ))}
        <div className="hub-column">
          <div className="inner-hub">
            <GraphicsCanvas />
            <TurnMenu />
            <ConfirmButton />
            <BattleLog />
          </div>
        </div>
        {Object.values(splitChars.enemies).map((enemy, index) => (
          <Enemy key={enemy.id} index={index} {...enemy} />
        ))}
        <div className="left-spacer" />
      </div>
    </>
  );
}

export default GameBoard;
