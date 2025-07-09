import {StatsType} from "../../../types/game.ts";
import {calcRawMitigation, limitToZero, truncate} from "../utils/combatUtils.ts";
import {DamageType} from "../../../types/maneuvers.ts";

export function slapOther(defenderStats: StatsType, {damage, damageType}: {damage: number, damageType: DamageType}): StatsType {
    const rawMitigation = calcRawMitigation(defenderStats, damageType);
    const mitigatedDamage = limitToZero(damage - rawMitigation);
    return {
        ...defenderStats,
        hitPoints: truncate(defenderStats.hitPoints - mitigatedDamage)
    };
}

export function slapSelf(attackerStats: StatsType, speedCost: number): StatsType {
    return {
        ...attackerStats,
        speed: attackerStats.speed - speedCost
    };
}