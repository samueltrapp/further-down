import { useContext, useEffect } from "react";
import { socket } from "./utils/socket";
import { GameContext, GameDispatchContext } from "./contexts/GameContext";
import { GameActions, GameType } from "../types";
import GameBoard from "./pages/GameBoard";
import "./App.css";

function App() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);

  useEffect(() => {
    function onConnect() {
      // Load existing or create new game
      const existingGame = localStorage.getItem("gameId");
      if (existingGame) {
        socket.emit("load", existingGame);
      }
      else {
        socket.emit("create");
      }
    }

    function onUpdateGameState(updatedGame: GameType) {
      // Manage lapsed game ID and set new game ID
      if (updatedGame === undefined) {
        localStorage.removeItem("game_id");
      }
      if (!localStorage.getItem("game_id")) {
        localStorage.setItem("game_id", updatedGame.gameId)
      }

      if (dispatch) {
        dispatch({
          type: GameActions.SYNC,
          payload: updatedGame.characters
      });
      }
      
    }

    socket.connect();
    socket.on("connect", onConnect);
    socket.on("update", (game) => onUpdateGameState(game));

    return () => {
      socket.off("connect", onConnect);
      socket.off("update", (game) => onUpdateGameState(game));
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (!game) {
      socket.emit("create");
    }
  }, [game]);

  return (
    <div className="container">
      <GameBoard />
    </div>
  );
}

export default App;
