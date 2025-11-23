import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext.tsx";
import styled from "styled-components";
import "./Hud.css";

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
  const battle = game?.data.battle;
  const characters = game?.data.characters;

  if (!game || !battle || !characters) {
    return null;
  }

  const allCharacters = {
    ...characters.players,
    ...characters.enemies,
  };
  const turnTracker = battle.turnOrder.map((turnId) => {
    const turnChar = allCharacters[turnId];
    return {
      name: turnChar?.name,
      speed: turnChar?.stats.speed,
    };
  });

  return (
    <div className="turn-tracker-container">
      {turnTracker?.slice(0, 3)?.map((turn, index) => (
        <TurnTrackerRow
          key={battle?.turnOrder[index]}
          $position={index as RangeThree}
        >
          <div className="name-label">{turn.name}</div>
          <div className="speed-label">{turn.speed}</div>
        </TurnTrackerRow>
      ))}
    </div>
  );
}
