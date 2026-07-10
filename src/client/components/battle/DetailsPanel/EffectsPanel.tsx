import {
  EffectState,
  EnemyType,
  PlayerType,
} from "../../../../types/individual/characters.ts";
import { EffectName } from "../../../../types/equipables/effects.ts";
import { toCaps } from "../../../utils/formatting.ts";
import { effectMap } from "../../../../shared/definitions/effects/sets.ts";
import { useGame } from "../../../hooks/useGame.ts";

const EffectText = ({
  effectName,
  stacks,
  durations,
}: {
  effectName: EffectName;
  stacks: number;
  durations?: number[];
}) => {
  const effect = effectMap.get(effectName);
  if (!effect) return null;

  const tickDuration =
    effect.durationType === "turns" || effect.durationType === "rounds";
  const unit =
    effect.durationType === "turns"
      ? "t"
      : effect.durationType === "rounds"
        ? "r"
        : null;

  let label = toCaps(effectName);
  if (effect.stackable) {
    label += `: ${stacks}`;
  }
  if (tickDuration && durations && unit) {
    const minRemaining = Math.min(...durations);
    label += ` (${minRemaining}${unit})`;
  }

  return <span>{label}</span>;
};

/* Burn/bleed burdens are tracked per owner, so each source is rendered as its
   own entry labelled with whoever applied it rather than merged into one total. */
const SourceText = ({
  effectName,
  stacks,
  ownerName,
}: {
  effectName: EffectName;
  stacks: number;
  ownerName: string;
}) => {
  const effect = effectMap.get(effectName);
  if (!effect) return null;

  let label = toCaps(effectName);
  if (effect.stackable) {
    label += `: ${stacks}`;
  }
  label += ` (from ${ownerName})`;

  return <span>{label}</span>;
};

export default function EffectsPanel({
  character,
}: {
  character: PlayerType | EnemyType;
}) {
  const { game } = useGame();
  const characters = game?.data.characters ?? {};

  const effects = character.effects;

  const blankEffectsList: {
    burdens: [EffectName, EffectState][];
    favors: [EffectName, EffectState][];
  } = { burdens: [], favors: [] };
  const effectsList = (
    Object.entries(effects) as [EffectName, EffectState][]
  ).reduce((effectsList, currentEffect) => {
    const effectDtl = effectMap.get(currentEffect[0]);
    /* Burn/bleed burdens are rendered separately below, per owner */
    if (effectDtl?.special === "burn" || effectDtl?.special === "bleed") {
      return effectsList;
    }
    if (effectDtl?.type === "burden") {
      effectsList.burdens.push(currentEffect);
    } else if (effectDtl?.type === "favor") {
      effectsList.favors.push(currentEffect);
    }
    return effectsList;
  }, blankEffectsList);

  const burnEntries = Object.entries(character.burnSources).flatMap(
    ([ownerId, sources]) => sources.map((source) => ({ ownerId, source })),
  );
  const bleedEntries = Object.entries(character.bleedSources).flatMap(
    ([ownerId, sources]) => sources.map((source) => ({ ownerId, source })),
  );

  return (
    <div>
      <h2>Effects</h2>
      <h3>Favors</h3>
      {effectsList.favors.map((favor) => (
        <div key={favor[0]}>
          <EffectText
            effectName={favor[0]}
            stacks={favor[1].value}
            durations={favor[1].durations}
          />
        </div>
      ))}
      <h3>Burdens</h3>
      {effectsList.burdens.map((burden) => (
        <div key={burden[0]}>
          <EffectText
            effectName={burden[0]}
            stacks={burden[1].value}
            durations={burden[1].durations}
          />
        </div>
      ))}
      {burnEntries.map(({ ownerId, source }) => (
        <div key={`burn-${ownerId}-${source.name}`}>
          <SourceText
            effectName={source.name}
            stacks={source.stacks}
            ownerName={characters[ownerId]?.name ?? "unknown"}
          />
        </div>
      ))}
      {bleedEntries.map(({ ownerId, source }) => (
        <div key={`bleed-${ownerId}-${source.name}`}>
          <SourceText
            effectName={source.name}
            stacks={source.stacks}
            ownerName={characters[ownerId]?.name ?? "unknown"}
          />
        </div>
      ))}
    </div>
  );
}
