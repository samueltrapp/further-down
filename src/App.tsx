import { useEffect, useState } from "react";
import GameBoard from "./client/pages/GameBoard";
import { socket } from "./client/utils/socket";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [hp, setHp] = useState(100);

  useEffect(() => {
    const updateHp = (hp: number) => {
      setHp(hp);
    };
    
    function onConnect() {
      console.log("Connected");
      setIsConnected(true);
    }

    socket.connect();
    socket.on("connect", onConnect);
    socket.on("update", updateHp);

    return () => {
      socket.off("connect", onConnect);
      socket.off("update", updateHp);
      socket.disconnect();
    }
  }, []);


  return (
    <div className="container flex justify-center mx-auto">
      <GameBoard hp={hp} />
    </div>
  )
}

export default App
