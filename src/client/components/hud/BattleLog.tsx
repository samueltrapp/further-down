import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext.tsx";

export default function BattleLog() {
  const game = useContext(GameContext);
  const log = game?.client?.logHistory;

  console.log(log);

  return (
    <div className="battle-log central-column">
      <h3 className="battle-log-header">Battle Log</h3>
      <div style={{ display: "inline-block", verticalAlign: "bottom" }}>
        {log?.map((logLine) => (
          <p>{logLine}</p>
        ))}
      </div>
    </div>
  );
}
