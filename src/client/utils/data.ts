import { UniqueStatsType } from "../../types";

export function readCharacters(characterData: UniqueStatsType) {
    const entries = Object.entries(characterData);
    return entries.map((entry) => (
        {
            id: entry[0],
            stats: entry[1]
        }
    ));
}