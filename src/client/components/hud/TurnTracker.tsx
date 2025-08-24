import { useContext } from "react";
import { GameContext } from "../../contexts/GameContext.tsx";
import { UnitType } from "../../../types/individual/characters.ts";
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

  const turnTracker =
    characters &&
    battle?.turnOrder.map((turnId) => {
      const allCharacters = (characters?.players as UnitType[]).concat(
        characters?.enemies,
      );
      const turnChar = allCharacters?.find(
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
