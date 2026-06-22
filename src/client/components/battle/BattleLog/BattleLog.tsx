import { useGame } from "../../../hooks/useGame.ts";
import "./BattleLog.css";
import Button from "../../_core/Button.tsx";

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
      <Button
        className="autoscroll"
        variant="select"
        size="small"
        onClick={handleClick}
      >
        Latest
      </Button>
    </div>
  );
}
