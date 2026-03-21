import { useGame } from "../../hooks/useGame.ts";
import styled from "styled-components";
import "./TurnTracker.css";

type RangeThree = 0 | 1 | 2;

const mapColor = (position: RangeThree) => {
  switch (position) {
    case 0:
      return "var(--sunrise)";
    case 1:
      return "var(--sunset)";
    case 2:
      return "var(--orange)";
    default:
      return "var(--white)";
  }
};

const TurnTrackerRow = styled.li<{ $position: RangeThree }>`
  color: ${(props) => mapColor(props.$position)};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
`;

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
      speed: turnChar?.stats.speed,
    };
  });

  return (
    <div className="turn-tracker-container">
      <div className="m0 mta mba fs3">{`Round ${game.data.battle?.round}`}</div>
      <ul>
        {turnTracker?.slice(0, 3)?.map((turn, index) => (
          <TurnTrackerRow
            key={battle?.turnOrder[index]}
            $position={index as RangeThree}
          >
            <div className="name-label">{turn.name}</div>
            <div className="speed-label">{turn.speed}</div>
          </TurnTrackerRow>
        ))}
      </ul>
    </div>
  );
}
