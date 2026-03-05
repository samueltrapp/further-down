import { useGame } from "../../hooks/useGame.ts";
import "./BattleLog.css";
import "./Hud.css";

export default function BattleLog() {
  const { game } = useGame();
  const log = game?.data?.battle?.messages;

  const handleClick = () => {
    const battleLog = document.getElementById("battle-log");
    if (battleLog) {
      battleLog.scrollTop = battleLog.scrollHeight;
    }
  };

  return (
    <div className="central-column">
      <div id="battle-log" className="battle-log">
        <ul>
          {log?.map((logLine) => (
            <li>{logLine}</li>
          ))}
        </ul>
      </div>
      <button className="autoscroll" onClick={handleClick}>
        Latest
      </button>
    </div>
  );
}
