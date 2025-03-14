import { GameState } from "../types";

export const initialGameState: GameState = {
    characters: [
        {
            id: "1",
            name: "Guy 1",
            hitPoints: 100,
            physical: 15,
            speed: 95
        },
        {
            id: "2",
            name: "Guy 2",
            hitPoints: 85,
            physical: 24,
            speed: 80
        },
        {
            id: "3",
            name: "Guy 3",
            hitPoints: 85,
            physical: 24,
            speed: 90
        },
    ],
    enemies: [
        {
            id: "4",
            name: "Villain 1",
            hitPoints: 500,
            physical: 12,
            speed: 70
        },
        {
            id: "5",
            name: "Villain 2",
            hitPoints: 400,
            physical: 14,
            speed: 82
        }
    ],
    turn: "1"
};