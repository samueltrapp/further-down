import { ReactNode, useState } from "react";
import {
  CharacterContext,
  CharacterStateContext,
} from "./CharacterContext.tsx";
import { CharType } from "../../types/individual/characters.ts";

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [characters, setCharacters] = useState<CharType[]>([]);

  return (
    <CharacterContext.Provider value={characters}>
      <CharacterStateContext.Provider value={setCharacters}>
        {children}
      </CharacterStateContext.Provider>
    </CharacterContext.Provider>
  );
};
