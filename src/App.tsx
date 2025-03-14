import { useEffect, useState } from "react";
import GameBoard from "./client/pages/GameBoard";
import { socket } from "./client/utils/socket";
import { GameState } from "./types";
import "./App.css"

function App() {
  const [gameState, setGameState] = useState<GameState>(null);

  useEffect(() => {
    function onConnect() {
      socket.emit("get_game_state", gameState)
    }

    function onUpdateGameState(updatedGameState: GameState) {
      setGameState(updatedGameState)
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
      <GameBoard gameState={gameState} />
    </div>
  )
}

export default App
