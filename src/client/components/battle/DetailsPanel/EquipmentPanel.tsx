import {
  EnemyType,
  PlayerType,
} from "../../../../types/individual/characters.ts";

export default function EquipmentPanel({
  character,
}: {
  character: PlayerType | EnemyType;
}) {
  const weapons = character.loadout.weapons;
  const armors = character.loadout.armors;

  return (
    <div>
      <h2>Equipment</h2>
      <h3>Weapons</h3>
      {weapons.map((weapon) => (
        <div>
          <span>{weapon}</span>
        </div>
      ))}
      <h3>Armors</h3>
      {armors.map((armor) => (
        <div>
          <span>{armor}</span>
        </div>
      ))}
    </div>
  );
}
