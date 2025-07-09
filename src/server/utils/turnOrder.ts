import { CharType } from "../../types/game.ts";

type CharTurnType = {
    id: string,
    lastTurn: number,
    speed: number
};

export const resolveTurnOrder = (characters: CharType[]): string[] => {
    const charTurns = characters.map((character) => ({
        id: character.id,
        lastTurn: character.lastTurn,
        speed: character.stats.speed
    }));

    charTurns.sort((a: CharTurnType, b: CharTurnType) => {
        const relation = b.speed - a.speed;
        if (relation > 1) {
            return 1;
        }
        else if (relation < 1) {
            return -1;
        }
        else {
            // Break tie randomly if neither player has gone
            if (a.lastTurn === 0 && b.lastTurn === 0) {
                return Math.random() - 0.5;
            }
            // Break other ties by picking the player who went longest ago
            else {
                return b.lastTurn > a.lastTurn ? -1 : 1;
            }
        }
    });

    return charTurns.map((charTurn) => charTurn.id)
}