import {HitStep} from "../../../types/equipables/actions.ts";
import {ActionCtx} from "../../turn/actions/actionCtx.ts";
import {randNum} from "../../../common/utils.ts";
import {trunc} from "../../turn/utils/battle.ts";

const createSpread = (spread: number) => randNum(spread * 2) - spread;

export const damage = (step: HitStep, ctx: ActionCtx) => {
    const { damageType, strength } = step;
    const { characters, sourceId, weapon } = ctx;

    const source = characters.get(sourceId);
    if (!source) {
        return ctx;
    }

    const stats = source.stats;
    const baseDamage = weapon.power + createSpread(weapon.spread);

    const {
        physical: phAff,
        magical: mgAff,
        bladed: bldAff,
        blunt: bltAff,
        elemental: eleAff,
        psychic: psyAff,
    } = weapon.affinities;

    const damage = () => {
        switch (damageType) {
            case "bladed":
                return baseDamage + phAff * stats.physical + bltAff * stats.bladed;
            case "blunt":
                return baseDamage + phAff * stats.physical + bldAff * stats.blunt;
            case "elemental":
                return baseDamage + mgAff * stats.magical + eleAff * stats.elemental;
            case "psychic":
                return baseDamage + mgAff * stats.magical + psyAff * stats.psychic;
            default:
                return 0;
        }
    }

    const damageInstance = [...ctx.damage, trunc(strength * damage())];

    return {
        ...ctx,
        damage: damageInstance
    };
}