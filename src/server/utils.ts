import { CharType } from "../types";

export const createInitialTurnOrder = (characters: CharType[]) => {
    const charTurns = characters.map((character) => ({
        id: character.id,
        speed: character.stats.speed
    }));

    charTurns.sort((a, b) => {
        const relation = b.speed - a.speed;
        if (relation > 1) {
            return 1;
        }
        else if (relation < 1) {
            return -1;
        }
        else {
            return Math.random() - 0.5;
        }
    });

    return charTurns.map((charTurn) => charTurn.id)
}

// const resolveTurnOrder = (characters: CharType[], ) => {

// }