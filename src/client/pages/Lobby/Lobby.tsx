import { useContext, useEffect, useState } from "react";
import { LobbyContext } from "../../contexts/LobbyContext.tsx";
import { randomId } from "../../../server/utils/data.ts";
import { socket } from "../../socket.ts";
import "./Lobby.scss";

const Unjoined = () => {
  const lobby = useContext(LobbyContext);
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    if (localStorage.getItem("playerId") === null) {
      const playerId = randomId(8);
      localStorage.setItem("playerId", playerId);
    }
  }, []);

  const handleCreateRoom = () => {
    const playerId = localStorage.getItem("playerId");
    if (playerId) {
      socket.emit("create", playerId);
    }
  };

  const handleJoinRoom = () => {
    const playerId = localStorage.getItem("playerId");
    if (playerId) {
      socket.emit("join", { gameId: roomCode, playerId });
    }
  };

  return (
    <div>
      <div>
        <span>{lobby?.errorMsg}</span>
      </div>
      <div className="controls">
        <div className="option">
          <button className="lobby-btn" onClick={handleCreateRoom}>
            Create a New Game
          </button>
        </div>
        <div className="option">
          <input
            type="text"
            onChange={(event) => setRoomCode(event.target.value)}
            placeholder="Room Code"
            value={roomCode}
          />
          <button className="lobby-btn" onClick={handleJoinRoom}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

const Waiting = () => {
  const lobby = useContext(LobbyContext);
  const [voteToStart, setVoteToStart] = useState(false);

  const handleStart = () => {
    socket.emit("vote", { gameId: lobby?.gameId, voteToStart: !voteToStart });
    setVoteToStart(!voteToStart);
  };

  return (
    <div>
      <div>{`Room Code: ${lobby?.gameId}`}</div>
      <div>{`${lobby?.players.length}/4 Players`}</div>
      <div>
        <button onClick={handleStart}>{!voteToStart ? "Start" : "Wait"}</button>
      </div>
    </div>
  );
};

export function Lobby() {
  const lobby = useContext(LobbyContext);

  return lobby?.status === "unjoined" ? <Unjoined /> : <Waiting />;
}
