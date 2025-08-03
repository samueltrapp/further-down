// TODO: Create system to join and start games

import { MouseEvent, useState } from "react";
import { socket } from "../utils/socket.ts";

export function Lobby() {
  const [roomCode, setRoomCode] = useState("");

  const handleJoinGame = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    socket.emit("join", roomCode);
  };

  return (
    <div>
      <input
        type="text"
        onChange={(event) => setRoomCode(event.target.value)}
        value={roomCode}
      />
      <button onClick={handleJoinGame}>Join</button>
      <button>Create</button>
    </div>
  );
}
