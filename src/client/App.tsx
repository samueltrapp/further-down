import { useContext, useEffect } from "react";
import { socket } from "./utils/socket";
import { GameContext, GameDispatchContext } from "./contexts/GameContext";
import { GameActions, GameType } from "../types/game.ts";
import GameBoard from "./pages/GameBoard";
import "./App.css";
import "animate.css";

function App() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);

  useEffect(() => {
    // Load existing or create new game
    function onConnect() {
      const existingGame = localStorage.getItem("gameId");
      if (existingGame) {
        socket.emit("load", existingGame);
      } else {
        socket.emit("create");
      }
    }

    function onUpdateGameState(updatedGame: GameType) {
      // if (updatedGame === undefined) {
      //   localStorage.removeItem("game_id");
      // }
      // if (!localStorage.getItem("game_id")) {
      //   localStorage.setItem("game_id", updatedGame.gameId)
      // }

      if (dispatch) {
        dispatch({
          type: GameActions.SYNC,
          payload: updatedGame,
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
    };
  }, [dispatch]);

  // Start new game if no game exists
  useEffect(() => {
    if (!game) {
      socket.emit("create");
    }
  }, [game]);

  return (
    <div className="container">
      <h1 className="title animate__animated animate__fadeIn">Further Down</h1>
      <GameBoard />
    </div>
  );
}

export default App;
