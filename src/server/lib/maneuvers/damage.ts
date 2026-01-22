import {HitStep} from "../../../types/equipables/actions.ts";
import {StepCtx} from "../../turn/actions/actionCtx.ts";
import {randNum} from "../../../common/utils.ts";
import {limitToZero, trunc} from "../../turn/utils/battle.ts";
import {randomInt} from "node:crypto";

const createSpread = (spread: number) => randNum(spread * 2) - spread;

export const damage = (step: HitStep, ctx: StepCtx) => {
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

    const damageInstance = trunc(strength * damage());
    const stepAccuracy = source.stats.accuracy + step.accuracy;
    const stepRoll = randomInt(100);

    return {
        ...ctx,
        toHit: stepRoll,
        accuracy: stepAccuracy,
        damage: damageInstance
    };
}

export const applyDamage = (ctx: StepCtx) => {
    const { characters, damage, mitigation } = ctx;

    mitigation.forEach((v, k) => {
        const revisedAccuracy = ctx.accuracy - v.evasion;
        if (ctx.toHit > revisedAccuracy) {
            // miss
        }
        else {
            const character = characters.get(k);
            const reducedDamage = limitToZero(damage - v.reduction);

            const updatedCharacter = character ? {
                ...character,
                stats: {
                    ...character.stats,
                    life: character.stats.life - reducedDamage
                }
            } : character;
            characters.set(k, updatedCharacter);
        }
    });

    return {
        ...ctx,
        characters
    };
}