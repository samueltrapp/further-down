import { useGame } from "../../../hooks/useGame.ts";
import "./TurnTracker.css";

const mapColor = (index: number) => {
  switch (index) {
    case 0:
      return "first-place";
    case 1:
      return "second-place";
    case 2:
      return "third-place";
    default:
      return "later";
  }
};

export default function TurnTracker() {
  const { game } = useGame();
  const battle = game?.data.battle;
  const characters = game?.data.characters;

  if (!game || !battle || !characters) {
    return null;
  }

  const turnTracker = battle.turnOrder.map((turnId) => {
    const turnChar = characters[turnId];
    return {
      name: turnChar?.name,
      speed: turnChar?.stats.core.speed,
    };
  });

  return (
    <div className="pb3 turn-tracker-container">
      <div className="m0 mta mba fs3">{`Round ${game.data.battle?.round}`}</div>
      <ul className="m0 df">
        {turnTracker?.map((turn, index) => (
          <div
            key={battle?.turnOrder[index]}
            className={`pl6 ${mapColor(index)}`}
          >
            <div>{turn.name}</div>
            <div className="pl3">{turn.speed}</div>
          </div>
        ))}
      </ul>
    </div>
  );
}
