import { CharacterDataType, CombatStats, GuaranteedCharacterDataType, TurnActions, TurnType } from "../types.ts";

const alliedActions = [
    TurnActions.HEAL
];

const enemyActions = [
    TurnActions.ATTACK
];

export function resolveTurn(turn: TurnType, characterData: CharacterDataType) {
    if (!characterData) return characterData;
    const { action, issuerId, targetIds } = turn;

    const targetsEnemies = enemyActions.includes(action);
    const targets = targetsEnemies ? characterData.enemies : characterData.players;
    const damage = characterData.players.find((player) => player.id === issuerId)?.stats.physical || 0;

    const newTargets = targets.map((target) => {
        if (!targetIds.includes(target.id)) {
            return target;
        }
        else {
            return {...target,
                stats: {
                    ...target.stats,
                    hitPoints: Math.max(0, target.stats.hitPoints - damage)
                }
            }
        }
    });

    return {
        players: targetsEnemies ? characterData.players : newTargets,
        enemies: targetsEnemies ? newTargets : characterData.enemies
    };
}