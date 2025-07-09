import {GameType, StatsType} from "../../../types/game.ts";
import {resolveTurnOrder} from "../../utils/turnOrder.ts";
import {calcMitigatedDamage, calcRawDamage, calcRawMitigation, findCharacter} from "../utils/combatUtils.ts";

const speedCost = 10;
const damageType = "blunt";
const strength = 0.8;
//const hits = 1;

function slapEnemy(defenderStats: StatsType, damage: number) {
    const rawMitigation = calcRawMitigation(defenderStats, damageType);
    const mitigatedDamage = calcMitigatedDamage(damage, rawMitigation);
    return {
        ...defenderStats,
        hitPoints: defenderStats.hitPoints - mitigatedDamage
    };
}

function slapSelf(attackerStats: StatsType) {
    return {
        ...attackerStats,
        speed: attackerStats.speed - speedCost
    }
}

export function mnvSlap(game: GameType, issuerId: string, targetIds: string[]): GameType {
    const characters = game.characters;
    const updatedCharacters = [...game.characters];

    // Find attacker's stats
    const [attacker, attackerId] = findCharacter(characters, issuerId);
    const rawDamage = calcRawDamage(attacker.stats, damageType);
    const modifiedDamage = rawDamage * strength;

    // Find defenders' stats
    const defenders = targetIds.map((targetId) => findCharacter(characters, targetId));
    defenders.forEach((defendingChar) => {
        const defender = defendingChar[0];
        const defenderId = defendingChar[1];
        updatedCharacters[defenderId] = {
            ...updatedCharacters[defenderId],
            stats: slapEnemy(defender.stats, modifiedDamage)
        }
    });

    updatedCharacters[attackerId] = {
        ...game.characters[attackerId],
        lastTurn: game.turnNumber,
        stats: slapSelf(attacker.stats)
    };

    return {
        ...game,
        characters: updatedCharacters,
        turnNumber: game.turnNumber + 1,
        turnOrder: resolveTurnOrder(updatedCharacters)
    };
}