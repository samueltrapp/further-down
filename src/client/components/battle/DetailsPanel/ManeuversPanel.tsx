import {
  EnemyType,
  PlayerType,
} from "../../../../types/individual/characters.ts";

export default function ManeuversPanel({
  character,
}: {
  character: PlayerType | EnemyType;
}) {
  const maneuvers = character.loadout.maneuvers;

  return (
    <div>
      <h3>Maneuvers</h3>
      {maneuvers.map((maneuver) => (
        <div>
          <span>{maneuver}</span>
        </div>
      ))}
    </div>
  );
}
