import { useContext, useEffect, useState } from "react";
import { randomId } from "../../../server/utils/data.ts";
import { socket } from "../../socket.ts";
import "./Lobby.scss";
import { GameContext } from "../../contexts/GameContext.tsx";

const Unjoined = () => {
  const game = useContext(GameContext);
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
      socket.emit("create", userId);
    }
  };

  const handleJoinRoom = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      socket.emit("join", { gameId: roomCode, userId });
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
  const game = useContext(GameContext);
  const lobby = game?.data.lobby;
  const [voteToStart, setVoteToStart] = useState(false);

  const handleStart = () => {
    socket.emit("vote", { gameId: lobby?.gameId, voteToStart: !voteToStart });
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
  const game = useContext(GameContext);
  return game?.data.lobby.status === "unjoined" ? <Unjoined /> : <Waiting />;
}
