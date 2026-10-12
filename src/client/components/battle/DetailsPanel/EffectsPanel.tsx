import {
  EffectState,
  EnemyType,
  PlayerType,
} from "../../../../types/individual/characters.ts";
import { EffectName } from "../../../../types/equipables/effects.ts";
import { toCaps } from "../../../utils/formatting.ts";
import { effectMap } from "../../../../shared/definitions/effects/sets.ts";
import { useGame } from "../../../hooks/useGame.ts";
import { stackSum } from "../../../../shared/utils.ts";

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
  if (effect.stackType !== "none") {
    label += `: ${stacks}`;
  }
  if (tickDuration && durations && unit) {
    const minRemaining = Math.min(...durations);
    label += ` (${minRemaining}${unit})`;
  }

  return <span>{label}</span>;
};

/* Burn/bleed burdens are tracked per-stack (each stack has its own owner), so
   each stack is rendered as its own entry labelled with whoever applied it
   rather than merged into one total. */
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
  if (effect.stackType !== "none") {
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
    burnEntries: { effectName: EffectName; owner: string; value: number }[];
    bleedEntries: { effectName: EffectName; owner: string; value: number }[];
  } = { burdens: [], favors: [], burnEntries: [], bleedEntries: [] };
  const effectsList = (
    Object.entries(effects) as [EffectName, EffectState][]
  ).reduce((effectsList, currentEffect) => {
    const [effectName, state] = currentEffect;
    const effectDtl = effectMap.get(effectName);

    /* Burn/bleed burdens are rendered separately below, per stack/owner */
    if (effectDtl?.special === "burn") {
      state.stacks.forEach((stack) =>
        effectsList.burnEntries.push({
          effectName,
          owner: stack.owner,
          value: stack.value,
        }),
      );
      return effectsList;
    }
    if (effectDtl?.special === "bleed") {
      state.stacks.forEach((stack) =>
        effectsList.bleedEntries.push({
          effectName,
          owner: stack.owner,
          value: stack.value,
        }),
      );
      return effectsList;
    }
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
          <EffectText
            effectName={favor[0]}
            stacks={stackSum(favor[1].stacks)}
            durations={favor[1].stacks.map((stack) => stack.duration)}
          />
        </div>
      ))}
      <h3>Burdens</h3>
      {effectsList.burdens.map((burden) => (
        <div key={burden[0]}>
          <EffectText
            effectName={burden[0]}
            stacks={stackSum(burden[1].stacks)}
            durations={burden[1].stacks.map((stack) => stack.duration)}
          />
        </div>
      ))}
      {effectsList.burnEntries.map(({ effectName, owner, value }, index) => (
        <div key={`burn-${owner}-${effectName}-${index}`}>
          <SourceText
            effectName={effectName}
            stacks={value}
            ownerName={characters[owner]?.name ?? "unknown"}
          />
        </div>
      ))}
      {effectsList.bleedEntries.map(({ effectName, owner, value }, index) => (
        <div key={`bleed-${owner}-${effectName}-${index}`}>
          <SourceText
            effectName={effectName}
            stacks={value}
            ownerName={characters[owner]?.name ?? "unknown"}
          />
        </div>
      ))}
    </div>
  );
}
