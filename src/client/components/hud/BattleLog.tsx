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
          {log?.map((logLine, index) => (
            <li key={logLine.headline + index}>
              {logLine.headline}
              <ul>
                {logLine.steps?.map((step, stepIndex) => (
                  <li key={step + index + stepIndex}>{step}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <button className="autoscroll" onClick={handleClick}>
        Latest
      </button>
    </div>
  );
}
