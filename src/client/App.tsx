import { useEffect, useState } from "react";
import { socket } from "./socket.ts";
import { GameType, LobbyStatus } from "../types/game.ts";
import GameBoard from "./pages/GameBoard/GameBoard.tsx";
import { Lobby } from "./pages/Lobby/Lobby.tsx";
import { Rewards } from "./components/interstitials/Rewards";
import { GameAction } from "./contexts/ContextTypes.ts";
import { useGame } from "./hooks/useGame.ts";
import "./App.css";
import Button from "./components/_core/Button.tsx";

const GameScreen = ({ lobbyStatus }: { lobbyStatus?: LobbyStatus }) => {
  switch (lobbyStatus) {
    case LobbyStatus.UNJOINED:
    case LobbyStatus.WAITING:
      return <Lobby />;
    case LobbyStatus.REWARD:
      return <Rewards />;
    case LobbyStatus.BATTLE:
      return <GameBoard />;
    default:
      return <div />;
  }
};

function App() {
  const [loaded, setLoaded] = useState(false);
  const { game, dispatch } = useGame();
  const lobbyStatus = game?.data.lobby.status;

  useEffect(() => {
    /* Load existing or create new game */
    function onConnect() {
      const gameId = localStorage.getItem("gameId");
      const userId = localStorage.getItem("userId");
      if (gameId && userId) {
        socket.emit("game:load", { gameId, userId });
      }
      setLoaded(true);
    }

    /* Warn about failed attempts to join */
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

    /* Update context based on new game state */
    function onUpdateGameState(update: { game: GameType }) {
      if (dispatch && update.game) {
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
    <>
      <nav className="nav-bar">
        <img
          className="nav-icon"
          src="/public/images/nav-icon.png"
          alt="Nav icon"
        />
        <div className="nav-links">
          <Button variant="outline">Rules</Button>
          <Button variant="outline">Abandon</Button>
        </div>
      </nav>
      {loaded && <GameScreen lobbyStatus={lobbyStatus} />}
    </>
  );
}

export default App;
