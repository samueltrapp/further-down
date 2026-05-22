import {
  EnemyType,
  PlayerType,
} from "../../../../types/individual/characters.ts";

export default function EffectsPanel({
  character,
}: {
  character: PlayerType | EnemyType;
}) {
  const favors = character.effects.favors;
  const burdens = character.effects.burdens;

  const favorsList = Object.entries(favors);
  const burdensList = Object.entries(burdens);

  return (
    <div>
      <h2>Effects</h2>
      <h3>Favors</h3>
      {favorsList.map((favor) => (
        <div>
          <span>{favor[0]}</span>
        </div>
      ))}
      <h3>Burdens</h3>
      {burdensList.map((burden) => (
        <div>
          <span>{burden[0]}</span>
        </div>
      ))}
    </div>
  );
}
