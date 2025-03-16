import { CharacterDataType, CombatStats, GuaranteedCharacterDataType, TurnActions, TurnType } from "../types.ts";

const alliedActions = [
    TurnActions.HEAL
];

const enemyActions = [
    TurnActions.ATTACK
];

function setUpStats(turn: TurnType, characterData: GuaranteedCharacterDataType): CombatStats {
    const { action, issuerId, targetIds } = turn;
    const attacker = characterData.players[issuerId as keyof CharacterDataType];
    const targets = targetIds.map((targetId: string) => enemyActions.includes(action)
        ? characterData.enemies[targetId as keyof CharacterDataType]
        : characterData.players[targetId as keyof CharacterDataType]);
    return { attacker, targets };
}

export function resolveTurn(turn: TurnType, characterData: CharacterDataType) {
    if (!characterData) return characterData;
    const characters = setUpStats(turn, characterData);
    const { action, issuerId, targetIds } = turn;

    const damage = characterData.players[issuerId as keyof CharacterDataType].physical;

    const enemyIds = Object.keys(characterData.enemies);
    const enemies = characterData.enemies;
    enemyIds.map((enemyId) => {
        const q = enemies[enemyId];
        return;
    });

    return characterData;

    // switch (turn.action) {
    //     case TurnActions.ATTACK:
    //         return standardAttack(characters);
    //     case TurnActions.HEAL:
    //         return standardHeal(characters);
    // }

}

function standardAttack(characters: CombatStats) {
    const { attacker, targets } = characters;
    const damage = attacker.physical;
    
    const newTargets = targets.map((target) => ({
        ...target,
        hitPoints: target.hitPoints - damage
    }));

    return newTargets;
}

function standardHeal(characters: CombatStats) {
    console.log(characters);
}