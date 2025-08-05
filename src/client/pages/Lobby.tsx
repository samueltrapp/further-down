import { useContext, useEffect, useState } from "react";
import { LobbyContext } from "../contexts/LobbyContext.tsx";
import { randomId } from "../../server/utils/data.ts";
import { socket } from "../utils/socket.ts";

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
      <div className="lobby-controls">
        <button onClick={handleCreateRoom}>Create</button>
        <input
          type="text"
          onChange={(event) => setRoomCode(event.target.value)}
          value={roomCode}
        />
        <button onClick={handleJoinRoom}>Join</button>
      </div>
    </div>
  );
};

const Waiting = () => {
  const lobby = useContext(LobbyContext);
  const handleStart = () => {
    socket.emit("start", lobby?.gameId);
  };

  return (
    <div>
      <div>{`Room Code: ${lobby?.gameId}`}</div>
      <div>{`${lobby?.players.length}/4 Players`}</div>
      <div>
        <button onClick={handleStart}>Start</button>
      </div>
    </div>
  );
};

export function Lobby() {
  const lobby = useContext(LobbyContext);

  return lobby?.gameId ? <Waiting /> : <Unjoined />;
}
