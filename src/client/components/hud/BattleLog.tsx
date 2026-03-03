import { useGame } from "../../hooks/useGame.ts";
import "./BattleLog.css";
import "./Hud.css";

export default function BattleLog() {
  const { game } = useGame();
  const log = game?.data?.battle?.messages;

  return (
    <div className="battle-log central-column">
      <ul>
        {log?.map((logLine) => (
          <li>{logLine}</li>
        ))}
      </ul>
    </div>
  );
}
