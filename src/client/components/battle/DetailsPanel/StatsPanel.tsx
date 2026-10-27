import {
  EnemyType,
  PlayerType,
} from "../../../../types/individual/characters.ts";
import "./StatsPanel.css";

export default function StatsPanel({
  character,
}: {
  character: PlayerType | EnemyType;
}) {
  const stats = character.stats;

  return (
    <div>
      <h2 className="spec-font fs4 ta-center mt2 mb3">{character.name}</h2>
      <h3 className="fs3">Core</h3>
      <div className="stat-category">
        <div>Life: {stats.core.life}</div>
        <div>Speed: {stats.core.speed}</div>
        <div>Max Life: {stats.core.maxLife}</div>
        <div>Max Speed: {stats.core.maxSpeed}</div>
      </div>
      <h3 className="fs3">Discipline</h3>
      <div className="stat-category">
        <div>Martial: {stats.discipline.martial}</div>
        <div>Defense: {stats.discipline.defense}</div>
        <div>Mystic: {stats.discipline.mystic}</div>
        <div>Resistance: {stats.discipline.resistance}</div>
        <div>Precision: {stats.discipline.precision}</div>
        <div>Dodge: {stats.discipline.dodge}</div>
        <div>Control: {stats.discipline.control}</div>
        <div>Negation: {stats.discipline.negation}</div>
      </div>
      <h3 className="fs3">Mastery</h3>
      <div className="stat-category">
        <div>Bladed: {stats.mastery.bladed}</div>
        <div>Plating: {stats.mastery.plating}</div>
        <div>Blunt: {stats.mastery.blunt}</div>
        <div>Padding: {stats.mastery.padding}</div>
        <div>Elemental: {stats.mastery.elemental}</div>
        <div>Dampening: {stats.mastery.dampening}</div>
        <div>Psychic: {stats.mastery.psychic}</div>
        <div>Warding: {stats.mastery.warding}</div>
      </div>
    </div>
  );
}
