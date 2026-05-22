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
        <div>Life: {stats.life}</div>
        <div>Speed: {stats.speed}</div>
        <div>Max Life: {stats.maxLife}</div>
        <div>Max Speed: {stats.maxSpeed}</div>
      </div>
      <h3 className="fs3">Discipline</h3>
      <div className="stat-category">
        <div>Physical: {stats.physical}</div>
        <div>Defense: {stats.defense}</div>
        <div>Magical: {stats.magical}</div>
        <div>Resistance: {stats.resistance}</div>
      </div>
      <h3 className="fs3">Specialty</h3>
      <div className="stat-category">
        <div>Bladed: {stats.bladed}</div>
        <div>Plating: {stats.plating}</div>
        <div>Blunt: {stats.blunt}</div>
        <div>Padding: {stats.padding}</div>
        <div>Elemental: {stats.elemental}</div>
        <div>Dampening: {stats.dampening}</div>
        <div>Psychic: {stats.psychic}</div>
        <div>Warding: {stats.warding}</div>
      </div>
    </div>
  );
}
