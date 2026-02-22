import { useEffect, useState } from "react";
import { randomId } from "../../../server/utils/character.ts";
import { socket } from "../../socket.ts";
import "./Lobby.scss";
import { useGame } from "../../hooks/useGame.ts";

const Unjoined = () => {
  const { game } = useGame();
  const [roomCode, setRoomCode] = useState("");

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
          <button className="lobby-btn" onClick={handleCreateRoom}>
            Create a New Game
          </button>
        </div>
        <div className="option">
          <button className="lobby-btn" onClick={handleJoinRoom}>
            Join
          </button>
          <input
            className="room-input"
            type="text"
            onChange={(event) => setRoomCode(event.target.value)}
            placeholder="Room Code"
            value={roomCode}
          />
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
    <div>
      <h2>{`Room Code: ${lobby?.gameId}`}</h2>
      <div>{`${lobby?.users.length}/4 Players`}</div>
      <div>
        <button onClick={handleStart}>{!voteToStart ? "Start" : "Wait"}</button>
      </div>
    </div>
  );
};

export function Lobby() {
  const { game } = useGame();
  return game?.data.lobby.status === "unjoined" ? <Unjoined /> : <Waiting />;
}
