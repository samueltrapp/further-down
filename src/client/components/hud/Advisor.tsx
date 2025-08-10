import { useContext } from "react";
import { BattleContext } from "../../contexts/BattleContext.tsx";

export default function Advisor() {
  const battle = useContext(BattleContext);
  // const playerId = game?.characters.find(game?.turnOrder)

  return (
    <div className="advisor-bar central-column">{battle?.speedElapsed}</div>
  );
}
