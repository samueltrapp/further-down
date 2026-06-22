import {
  EnemyType,
  PlayerType,
} from "../../../../types/individual/characters.ts";
import { EffectName } from "../../../../types/equipables/effects.ts";
import { toCaps } from "../../../utils/formatting.ts";
import { effectMap } from "../../../../shared/definitions/effects/sets.ts";

const EffectText = ({
  effectName,
  stacks,
}: {
  effectName: EffectName;
  stacks: number;
}) => {
  const effect = effectMap.get(effectName);
  return !effect ? null : (
    <span>{`${toCaps(effectName)}${effect.stackable ? `: ${stacks}` : ""}`}</span>
  );
};

export default function EffectsPanel({
  character,
}: {
  character: PlayerType | EnemyType;
}) {
  const effects = character.effects;

  const blankEffectsList: {
    burdens: [EffectName, number][];
    favors: [EffectName, number][];
  } = { burdens: [], favors: [] };
  const effectsList = (
    Object.entries(effects) as [EffectName, number][]
  ).reduce((effectsList, currentEffect) => {
    const effectDtl = effectMap.get(currentEffect[0]);
    if (effectDtl?.type === "burden") {
      effectsList.burdens.push(currentEffect);
    } else if (effectDtl?.type === "favor") {
      effectsList.favors.push(currentEffect);
    }
    return effectsList;
  }, blankEffectsList);

  return (
    <div>
      <h2>Effects</h2>
      <h3>Favors</h3>
      {effectsList.favors.map((favor) => (
        <div key={favor[0]}>
          <EffectText effectName={favor[0]} stacks={favor[1]} />
        </div>
      ))}
      <h3>Burdens</h3>
      {effectsList.burdens.map((burden) => (
        <div key={burden[0]}>
          <EffectText effectName={burden[0]} stacks={burden[1]} />
        </div>
      ))}
    </div>
  );
}
