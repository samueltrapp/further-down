import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext.tsx";

export default function BattleLog() {
  const game = useContext(GameContext);
  const log = game?.client?.logHistory;

  return (
    <div className="battle-log central-column">
      {log?.map((logLine) => (
        <p>{logLine}</p>
      ))}
    </div>
  );
}
