import { useContext } from "react";
import { GameContext, GameDispatchContext } from "../contexts/GameContext.tsx";

export function useGame() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);
  return { game, dispatch };
}
