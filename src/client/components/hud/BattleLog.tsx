import "./Hud.css";
import { useGame } from "../../hooks/useGame.ts";

export default function BattleLog() {
  const { game } = useGame();
  const log = game?.client?.logHistory;

  return (
    <div className="battle-log central-column">
      {log?.map((logLine) => (
        <p>{logLine}</p>
      ))}
    </div>
  );
}
