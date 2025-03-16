import { useEffect, useReducer } from "react";
import { socket } from "./client/utils/socket";
import { GameContext, GameDispatchContext } from "./client/contexts/GameContext";
import { CharacterDataType } from "./types";
import { GameActions, gameReducer } from "./client/reducers";
import GameBoard from "./client/pages/GameBoard";
import "./App.css"

function App() {
  const [game, dispatch] = useReducer(gameReducer, {characterData: null, selectedEnemyId: ""});

  useEffect(() => {
    function onConnect() {
      socket.emit("load_new_game")
    }

    function onUpdateGameState(updatedGame: CharacterDataType) {
      dispatch({
        type: GameActions.SYNC,
        payload: updatedGame
      })
    }

    socket.connect();
    socket.on("connect", onConnect);
    socket.on("update_game_state", onUpdateGameState);

    return () => {
      socket.off("connect", onConnect);
      socket.off("update_game_state", onUpdateGameState);
      socket.disconnect();
    }
  }, []);

  return (
    <div className="container">
      <GameContext.Provider value={game}>
        <GameDispatchContext.Provider value={dispatch}>
          <GameBoard />
        </GameDispatchContext.Provider>
      </GameContext.Provider>
    </div>
  )
}

export default App
