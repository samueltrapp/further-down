import {
  EnemyType,
  PlayerType,
} from "../../../../types/individual/characters.ts";
import { BurdenName, FavorName } from "../../../../types/equipables/effects.ts";
import { favorMap } from "../../../../shared/definitions/favors/sets.ts";
import { toCaps } from "../../../utils/formatting.ts";
import { burdenMap } from "../../../../shared/definitions/burdens/sets.ts";

const FavorText = ({
  favorName,
  stacks,
}: {
  favorName: FavorName;
  stacks: number;
}) => {
  const favor = favorMap.get(favorName);
  return !favor ? null : EffectText(favorName, favor.stackable, stacks);
};

const BurdenText = ({
  burdenName,
  stacks,
}: {
  burdenName: BurdenName;
  stacks: number;
}) => {
  const burden = burdenMap.get(burdenName);
  return !burden ? null : EffectText(burdenName, burden.stackable, stacks);
};

const EffectText = (name: string, stackable: boolean, stacks: number) => (
  <span>{`${toCaps(name)}${stackable ? `: ${stacks}` : ""}`}</span>
);

export default function EffectsPanel({
  character,
}: {
  character: PlayerType | EnemyType;
}) {
  const favors = character.effects.favors;
  const burdens = character.effects.burdens;

  const favorsList = Object.entries(favors) as [FavorName, number][];
  const burdensList = Object.entries(burdens) as [BurdenName, number][];

  return (
    <div>
      <h2>Effects</h2>
      <h3>Favors</h3>
      {favorsList.map((favor) => (
        <div>
          <FavorText favorName={favor[0]} stacks={favor[1]} />
        </div>
      ))}
      <h3>Burdens</h3>
      {burdensList.map((burden) => (
        <div>
          <BurdenText burdenName={burden[0]} stacks={burden[1]} />
        </div>
      ))}
    </div>
  );
}
