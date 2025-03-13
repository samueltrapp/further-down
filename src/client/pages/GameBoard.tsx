import { socket } from "../utils/socket";

function GameBoard({hp}: {hp: number}) {

  const handleAction = (action: "hit" | "heal") => {
    const effect = action === "hit" ? 10 : -10;
    socket.emit("action", effect);
  }

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