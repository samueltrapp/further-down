import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext.tsx";

export default function Advisor() {
  const game = useContext(GameContext);
  // const playerId = game?.characters.find(game?.turnOrder)

  return <div className="advisor-bar central-column">{game?.turnNumber}</div>;
}
