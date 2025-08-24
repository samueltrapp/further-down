import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext.tsx";

export default function Advisor() {
  const game = useContext(GameContext);
  const battle = game?.data.battle;
  // const userId = game?.characters.find(game?.turnOrder)

  return (
    <div className="advisor-bar central-column">{battle?.speedElapsed}</div>
  );
}
