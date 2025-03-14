export type CharacterState = {
    id: string,
    name: string,
    hitPoints: number,
    physical: number,
    speed: number
}

export type GameState = {
    characters: CharacterState[],
    enemies: CharacterState[],
    turn: string;
} | null;