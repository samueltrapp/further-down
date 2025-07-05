import {GameType, TurnType} from "../../types/game.ts";
import {resolveTurnOrder} from "../utils.ts";

type Q = (game: GameType, issuerId: string, targetIds: string[]) => GameType;

const maneuverMap = new Map<string, Q>;
maneuverMap.set("slap", mnvSlap);

export function resolveTurn(turn: TurnType, game: GameType): GameType {
    const { maneuver, issuerId, targetIds } = turn;
    return (maneuverMap.get(maneuver) as Q).call({}, game, issuerId, targetIds);
}

function mnvSlap(game: GameType, issuerId: string, targetIds: string[]): GameType {
    // const damageType = "blunt";
    const attackerId = game?.characters.findIndex((character) => character.id === issuerId);
    const attacker = game.characters[attackerId];
    const damage = attacker?.stats?.physical + attacker?.stats?.blunt;

    const defenderIds =
        targetIds.map((targetId) =>
            game?.characters.findIndex((character) => character.id === targetId));
    const defenders = defenderIds.map((defenderId) => game?.characters[defenderId]);

    defenders.forEach((target) => {
        target.stats.hitPoints -= damage
    });

    const updatedCharacters = [...game.characters];
    updatedCharacters[attackerId] = {
        ...game.characters[attackerId],
        lastTurn: game.turnNumber,
        stats: {
            ...game.characters[attackerId].stats,
            speed: game.characters[attackerId].stats.speed - 10
        }};

    return {
        ...game,
        characters: updatedCharacters,
        turnNumber: game.turnNumber + 1,
        turnOrder: resolveTurnOrder(updatedCharacters)
    };
}