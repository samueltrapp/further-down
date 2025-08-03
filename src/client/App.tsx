import { useContext, useEffect } from "react";
import { socket } from "./utils/socket";
import {
  BattleContext,
  BattleDispatchContext,
} from "./contexts/BattleContext.tsx";
import { GameActions, GameType } from "../types/game.ts";
import GameBoard from "./pages/GameBoard";
import "./App.css";
import "animate.css";
import { Lobby } from "./pages/Lobby.tsx";

function App() {
  const game = useContext(BattleContext);
  const dispatch = useContext(BattleDispatchContext);

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

    function onFailedJoin(msg: string) {
      alert(msg);
    }

    function onUpdateGameState(update: {
      game: GameType;
      logMessages: string[];
    }) {
      // if (updatedGame === undefined) {
      //   localStorage.removeItem("game_id");
      // }
      // if (!localStorage.getItem("game_id")) {
      //   localStorage.setItem("game_id", updatedGame.gameId)
      // }

      if (dispatch) {
        dispatch({
          type: GameActions.SYNC,
          payload: update.game,
        });
      }
    }

    socket.connect();
    socket.on("connect", onConnect);
    socket.on("rejectPlayer", (msg) => onFailedJoin(msg));
    socket.on("update", (update) => onUpdateGameState(update));

    return () => {
      socket.off("connect", onConnect);
      socket.off("rejectPlayer", (msg) => onFailedJoin(msg));
      socket.off("update", (update) => onUpdateGameState(update));
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
      {!game?.hasStarted && <Lobby />}
      {game?.hasStarted && <GameBoard />}
    </div>
  );
}

export default App;
