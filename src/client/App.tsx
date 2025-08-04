import { useContext, useEffect } from "react";
import { socket } from "./utils/socket";
import { BattleDispatchContext } from "./contexts/BattleContext.tsx";
import { GameActions, GameType } from "../types/game.ts";
import GameBoard from "./pages/GameBoard";
import "./App.css";
import { Lobby } from "./pages/Lobby.tsx";
import {
  LobbyContext,
  LobbyDispatchContext,
} from "./contexts/LobbyContext.tsx";

function App() {
  // const battle = useContext(BattleContext);
  const battleDispatch = useContext(BattleDispatchContext);
  const lobby = useContext(LobbyContext);
  const lobbyDispatch = useContext(LobbyDispatchContext);

  useEffect(() => {
    // Load existing or create new game
    function onConnect() {
      const existingGame = localStorage.getItem("gameId");
      if (existingGame) {
        socket.emit("load", existingGame);
      }
    }

    function onFailedJoin(msg: string) {
      if (lobbyDispatch) {
        lobbyDispatch({
          type: GameActions.SET_ERROR_MESSAGE,
          payload: {
            errorMessage: msg,
          },
        });
      }
    }

    function onUpdateGameState(update: {
      game: GameType;
      logMessages: string[];
    }) {
      if (battleDispatch) {
        battleDispatch({
          type: GameActions.SYNC,
          payload: {
            battle: update.game.battle,
          },
        });
      }
      if (lobbyDispatch) {
        lobbyDispatch({
          type: GameActions.SYNC,
          payload: {
            gameId: update.game.gameId,
            lobbyStatus: update.game.lobbyStatus,
            pastEncounters: update.game.pastEncounters,
            players: update.game.players,
          },
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
  }, [battleDispatch, lobbyDispatch]);

  return (
    <div className="container">
      {lobby?.lobbyStatus !== "started" ? <Lobby /> : <GameBoard />}
    </div>
  );
}

export default App;
