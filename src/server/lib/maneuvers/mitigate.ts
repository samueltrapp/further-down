import {HitStep} from "../../../types/equipables/actions.ts";
import {ActionCtx} from "../../turn/actions/actionCtx.ts";
import {StatsType} from "../../../types/individual/stats.ts";

export const mitigate = (step: HitStep, ctx: ActionCtx) => {
    const { damageType } = step;
    const { characters, enemyTargetIds } = ctx;
    const defenders = enemyTargetIds?.map(id => ({
        id: id,
        stats: characters.get(id)?.stats
    }))

    if (!defenders || defenders.length === 0) {
        return ctx;
    }

    const mitigation = (targetStat: StatsType | undefined) => {
        if (targetStat === undefined) {
            return 0;
        }

        switch (damageType) {
            case "blunt":
                return targetStat.defense + targetStat.plating;
            case "bladed":
                return targetStat.defense + targetStat.padding;
            case "elemental":
                return targetStat.resistance + targetStat.dampening;
            case "psychic":
                return targetStat.resistance + targetStat.warding;
            default:
                return 0;
        }
    };

    const mitigationMap = new Map<string, number>();
    defenders?.forEach((defender) => {
        mitigationMap.set(defender.id, mitigation(defender.stats));
    });

    return {
        ...ctx,
        mitigation: [...ctx.mitigation, mitigationMap]
    };
}