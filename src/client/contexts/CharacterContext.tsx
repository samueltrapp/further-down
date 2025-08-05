import { CharType } from "../../types/characters.ts";
import { createContext, Dispatch, SetStateAction } from "react";

export type CharacterStateType = CharType[];

export const CharacterContext = createContext<CharacterStateType>([]);
export const CharacterStateContext = createContext<Dispatch<
  SetStateAction<CharType[]>
> | null>(null);
