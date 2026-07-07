import {
    ApplyFnType,
    EffectType,
    RemoveFnType,
} from "../../../../types/equipables/effects.ts";
import {
    applyBurnSource,
    removeBurnSource,
} from "../../../../server/battle/burn.ts";

const FLAT_DAMAGE = 0.05;
const SCALING_DAMAGE = 0.05;

const applyFn: ApplyFnType = (ctx, ids) =>
    applyBurnSource(ctx, ids, FLAT_DAMAGE, SCALING_DAMAGE);

/* On removal, subtracts this owner's total contribution from each target's burn sources */
const removeFn: RemoveFnType = (ctx, ids) => {
    ids.forEach((id) => {
        const stacks = ctx.characters[id]?.effects["eternal flame"] ?? 0;
        removeBurnSource(
            ctx,
            [id],
            eternalFlame.owner,
            stacks * FLAT_DAMAGE,
            stacks * SCALING_DAMAGE,
        );
    });
    return ctx;
};

const eternalFlame: EffectType = {
    type: "burden",
    special: "burn",
    stackable: false,
    durationType: "rounds",
    flatDamage: FLAT_DAMAGE,
    scalingDamage: SCALING_DAMAGE,
    tooltip:
        "Burns for elemental damage each turn. Stacks increase damage per speed.",
    owner: "",
    onApply: applyFn,
    onRemove: removeFn,
};

export default eternalFlame;
