import { PerspectiveType, TeamType } from "../types/individual/characters.ts";
import { CharactersType } from "../types/game.ts";

export const randNum = (max: number) => Math.floor(Math.random() * max);
export const randEntry = (arr: unknown[]) => {
  const index = randNum(arr.length);
  return {
    pick: arr[index],
    altered: [...arr].splice(index, 1),
  };
};

const resolveTargetTeam = (team: TeamType, perspective: PerspectiveType) => {
  if (perspective === "own") {
    return team;
  } else {
    return team === "player" ? "enemy" : "player";
  }
};

export const validTargets = (
  characters: CharactersType,
  sourceTeam: TeamType,
  perspective: PerspectiveType,
) => {
  const targetTeam = resolveTargetTeam(sourceTeam, perspective);
  const charsArray = Object.values(characters);
  return charsArray.reduce((arr: string[], char) => {
    if (char.team === targetTeam && !char.isDead) {
      arr.push(char.id);
    }
    return arr;
  }, []);
};
