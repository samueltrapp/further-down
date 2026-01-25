import {PlayerType} from "../../../../types/individual/characters.ts";
import {DamageType, TagType} from "../../../../types/equipables/actions.ts";

export const thousandCuts = {
  type: "effect",
  priority: 6,
  fn
}

function fn({source, tags, damageType}: {source: PlayerType, tags: TagType, damageType: DamageType | undefined}) {

  if (tags.includes("attack") && damageType === "bladed") {
    const effect = source.effects.favors.thousandCuts;
    if (effect) {
      effect.stacks += 1;
    }
    else {
      source.effects.favors.thousandCuts = {
        stacks: 1,
        duration: "round",
        tooltip: "+1 BLD for each BLD hit until end of round",
        trigger: "hit"
      }
    }
    source.stats.bladed += 1;
  }
}
