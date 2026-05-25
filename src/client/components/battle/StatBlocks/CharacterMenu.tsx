import {
  EnemyType,
  PlayerType,
} from "../../../../types/individual/characters.ts";
import CharacterBlock from "./CharacterBlock.tsx";

export default function CharacterMenu({
  players,
  enemies,
}: {
  players: PlayerType[];
  enemies: EnemyType[];
}) {
  return (
    <div className="character-grid">
      {players.map((player, index) => (
        <CharacterBlock key={player.id} index={index} {...player} />
      ))}
      {enemies.map((enemy, index) => (
        <CharacterBlock key={enemy.id} index={index} {...enemy} />
      ))}
    </div>
  );
}
