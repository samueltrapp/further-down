// import {LobbyContext} from "../../contexts/LobbyContext.tsx";
import { useEffect, useState } from "react";
import { StatGrowth } from "../../components/interstitials/StatGrowth.tsx";
import { randomId } from "../../../server/utils/data.ts";

// const pickCharsPerPlayer = (playerCount: number) => {
//     switch (playerCount) {
//         case 1:
//             return 3;
//         case 2:
//             return 2;
//         case 3:
//         case 4:
//         default:
//             return 1;
//     }
// };

export function CharacterCreator() {
  const [createdChars] = useState(0);
  const [playerId, setPlayerId] = useState("");
  // const lobby = useContext(LobbyContext);
  // const charactersPerPlayer = pickCharsPerPlayer(lobby?.players?.length || 0);

  useEffect(() => {
    setPlayerId(randomId());
  }, [setPlayerId, createdChars]);

  return (
    <div>
      <div>
        <label htmlFor="name">Character Name</label>
        <input id="name" name="name" type="text" />
      </div>
      <StatGrowth id={playerId} corePoints={2} standardPoints={20} />
    </div>
  );
}
