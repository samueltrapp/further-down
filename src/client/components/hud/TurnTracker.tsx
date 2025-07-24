import { GameContext } from "../../contexts/GameContext.tsx";
import { useContext } from "react";
import "./Hud.css";
import styled from "styled-components";

type RangeThree = 0 | 1 | 2;

const mapColor = (position: RangeThree) => {
  switch (position) {
    case 0:
      return "var(--gold)";
    case 1:
      return "var(--silver)";
    case 2:
      return "var(--bronze)";
    default:
      return "var(--white)";
  }
};

const TurnTrackerRow = styled.div<{ $position: RangeThree }>`
  color: ${(props) => mapColor(props.$position)};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
`;

export default function TurnTracker() {
  const game = useContext(GameContext);

  const turnTracker = game?.turnOrder.map((turnId) => {
    const turnChar = game?.characters?.find(
      (character) => character.id === turnId,
    );
    return {
      name: turnChar?.name,
      speed: turnChar?.stats.speed,
    };
  });

  return (
    <div className="turn-tracker-container">
      {turnTracker?.slice(0, 3)?.map((turn, index) => (
        <TurnTrackerRow
          key={game?.turnOrder[index]}
          $position={index as RangeThree}
        >
          <div className="name-label">{turn.name}</div>
          <div className="speed-label">{turn.speed}</div>
        </TurnTrackerRow>
      ))}
    </div>
  );
}
