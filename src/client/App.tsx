import { useContext, useEffect } from "react";
import { socket } from "./socket.ts";
import { GameType, LobbyStatus } from "../types/game.ts";
import GameBoard from "./pages/GameBoard/GameBoard.tsx";
import { Lobby } from "./pages/Lobby/Lobby.tsx";
import { Rewards } from "./components/interstitials/Rewards";
import { GameAction } from "./contexts/ContextTypes.ts";
import { GameContext, GameDispatchContext } from "./contexts/GameContext.tsx";
import "./App.css";

function App() {
  const game = useContext(GameContext);
  const dispatch = useContext(GameDispatchContext);
  const lobbyStatus = game?.data.lobby.status;

  useEffect(() => {
    // Load existing or create new game
    function onConnect() {
      const existingGame = localStorage.getItem("gameId");
      if (existingGame) {
        socket.emit("load", existingGame);
      }
    }

    function onFailedJoin(msg: string) {
      if (dispatch) {
        dispatch({
          type: GameAction.SET_ERROR_MESSAGE,
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
      if (dispatch && update) {
        dispatch({
          type: GameAction.SYNC,
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

  return (
    <div className="container">
      {(lobbyStatus === LobbyStatus.UNJOINED ||
        lobbyStatus === LobbyStatus.WAITING) && <Lobby />}
      {lobbyStatus === LobbyStatus.REWARD && <Rewards />}
      {lobbyStatus === LobbyStatus.BATTLE && <GameBoard />}
    </div>
  );
}

export default App;
