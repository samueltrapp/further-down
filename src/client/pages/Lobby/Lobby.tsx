import { useEffect, useState } from "react";
import { randomId } from "../../../server/utils/character.ts";
import { socket } from "../../socket.ts";
import "./Lobby.css";
import { useGame } from "../../hooks/useGame.ts";
import Button from "../../components/core/Button.tsx";

const Unjoined = () => {
  const { game } = useGame();
  const [roomCode] = useState("");

  useEffect(() => {
    if (localStorage.getItem("userId") === null) {
      const userId = randomId(8);
      localStorage.setItem("userId", userId);
    }
  }, []);

  const handleCreateRoom = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("lobby:create", userId);
    }
  };

  const handleJoinRoom = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("lobby:join", { gameId: roomCode, userId });
    }
  };

  return (
    <div>
      <div>
        <span>{game?.data.lobby?.errorMessage}</span>
      </div>
      <div className="controls">
        <div className="option">
          <button className="special-font lobby-btn" onClick={handleCreateRoom}>
            New Game
          </button>
        </div>
        <div className="option">
          <button className="special-font lobby-btn" onClick={handleJoinRoom}>
            Join Game
          </button>
          {/*<input*/}
          {/*  className="room-input"*/}
          {/*  type="text"*/}
          {/*  onChange={(event) => setRoomCode(event.target.value)}*/}
          {/*  placeholder="Room Code"*/}
          {/*  value={roomCode}*/}
          {/*/>*/}
        </div>
      </div>
    </div>
  );
};

const Waiting = () => {
  const { game } = useGame();
  const lobby = game?.data.lobby;
  const [voteToStart, setVoteToStart] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (lobby?.gameId) {
      localStorage.setItem("gameId", lobby?.gameId);
    }
  }, [lobby]);

  const handleStart = () => {
    socket.emit("lobby:vote", {
      gameId: lobby?.gameId,
      vote: !voteToStart,
      userId: userId,
    });
    setVoteToStart(!voteToStart);
  };

  return (
    <section className="controls">
      <h2 className="mb2 fw1">{`Room Code: ${lobby?.gameId}`}</h2>
      <div className="mb5">{`${lobby?.users.length}/4 Players`}</div>
      <div>
        <Button variant="confirm" size="large" onClick={handleStart}>
          {!voteToStart ? "Start" : "Wait"}
        </Button>
      </div>
    </section>
  );
};

export function Lobby() {
  const { game } = useGame();
  return game?.data.lobby.status === "unjoined" ? <Unjoined /> : <Waiting />;
}
