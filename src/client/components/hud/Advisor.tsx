import { useContext } from "react";
import { BattleContext } from "../../contexts/BattleContext.tsx";

export default function Advisor() {
  const game = useContext(BattleContext);
  // const playerId = game?.characters.find(game?.turnOrder)

  return <div className="advisor-bar central-column">{game?.turnNumber}</div>;
}
