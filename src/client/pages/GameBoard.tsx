import { useState } from "react";
import { io } from "socket.io-client";

const socket = io();

function GameBoard() {
  const [hp, setHp] = useState(100);

  const handleAction = (action: "hit" | "heal") => {
    const newHp = action === "hit" ? hp - 10 : hp + 10;
    socket.emit("action", {hp: newHp});
  }

  socket.on("update", ({hp}) => {
    console.log(hp);
    setHp(hp);
  });
  
  return (
    <div className="grid grid-cols-12 gap-1">
      <div className="col-span-12">
        {hp}
      </div>
      <div className="col-span-12">
        <button
          onClick={() => handleAction("hit")}
        >
          Hit
        </button>
        <button
        onClick={() => handleAction("heal")}
        >
          Heal
        </button>
      </div>
    </div>
  );
}

export default GameBoard;