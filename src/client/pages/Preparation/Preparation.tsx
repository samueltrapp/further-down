// import {useContext, useState} from "react";
// import {GameContext} from "../../contexts/GameContext.tsx";
//
// export function Preparation() {
//     const game = useContext(GameContext);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const userId = localStorage.getItem("userId");
//
//     if (!game) {
//         return null;
//     }
//
//     const gameId = game.data.lobby.gameId;
//     const votes = game.data.lobby.votes;
//     const playerCharacters = Object.entries(game.data.characters.players).filter(
//         (playerCharacter) => playerCharacter[1].userId === userId,
//     );
//
//     if (currentIndex > playerCharacters.length - 1) {
//         return (
//             <div>
//                 Waiting for other players.
//             </div>
//         );
//     }
//     else {
//         return (
//             <button>
//             </button>
//         )
//     }
// }