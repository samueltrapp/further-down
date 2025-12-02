import { useState } from "react";
import { StatName, StatsType } from "../../../types/individual/stats.ts";
import "./StatGrowth.css";
import { takeStats } from "../../services/skill.ts";
import { PlayerType } from "../../../types/individual/characters.ts";

type StatClickFnType = (stat: StatName, add: boolean) => void;

const initialStats: StatsType = {
  life: 0,
  maxLife: 0,
  vitality: 20,
  speed: 21,
  maxSpeed: 20,
  physical: 0,
  magical: 0,
  bladed: 0,
  blunt: 0,
  elemental: 0,
  psychic: 0,
  defense: 0,
  resistance: 0,
  plating: 0,
  padding: 0,
  dampening: 0,
  warding: 0,
  evasion: 0,
  accuracy: 0,
};

const StatSlot = ({
  stats,
  baselineStats,
  stat,
  remainingPoints,
  handleClick,
}: {
  stats: StatsType;
  baselineStats: StatsType;
  stat: StatName;
  remainingPoints: number;
  handleClick: StatClickFnType;
}) => {
  const chosenStat = stats[stat];
  const baseline = baselineStats[stat];

  return (
    <div>
      {stat === "life" ? "LIFE" : stat.toUpperCase()}
      <button
        disabled={chosenStat <= baseline}
        onClick={() => handleClick(stat, false)}
      >
        -
      </button>
      {chosenStat}
      <button
        disabled={chosenStat >= 99 || remainingPoints <= 0}
        onClick={() => handleClick(stat, true)}
      >
        +
      </button>
    </div>
  );
};

export function StatGrowth({
  points,
  gameId,
  character,
  characterId,
}: {
  points: number;
  gameId: string;
  character: PlayerType;
  characterId: string;
}) {
  const baselineStats = character?.stats || initialStats;
  const [stats, setStats] = useState(baselineStats);
  const [remainingPoints, setRemainingPoints] = useState(points);

  function updateStats(stat: StatName, add: boolean) {
    setStats({
      ...stats,
      [stat]: stats[stat] + (add ? 1 : -1),
    });
    setRemainingPoints(remainingPoints - (add ? 1 : -1));
  }

  function submitStats() {
    takeStats({
      newStats: stats,
      gameId,
      characterId: characterId,
    });
  }

  return (
    <div className="stat-splash">
      <h2>Remaining Points: {remainingPoints}</h2>
      <h3>CORE STATS</h3>
      <div className="stat-cluster core">
        {["vitality", "speed"].map((stat) => (
          <StatSlot
            key={stat}
            stats={stats}
            stat={stat as StatName}
            baselineStats={baselineStats}
            remainingPoints={remainingPoints}
            handleClick={updateStats}
          />
        ))}
      </div>
      <h3>OTHER STATS</h3>
      <h4>OFFENSIVE</h4>
      <div className="stat-section">
        <div className="stat-cluster">
          {["physical", "bladed", "blunt"].map((stat) => (
            <StatSlot
              key={stat}
              stats={stats}
              stat={stat as StatName}
              baselineStats={baselineStats}
              remainingPoints={remainingPoints}
              handleClick={updateStats}
            />
          ))}
        </div>
        <div className="stat-cluster">
          {["magical", "elemental", "psychic"].map((stat) => (
            <StatSlot
              key={stat}
              stats={stats}
              stat={stat as StatName}
              baselineStats={baselineStats}
              remainingPoints={remainingPoints}
              handleClick={updateStats}
            />
          ))}
        </div>
      </div>
      <h4>DEFENSIVE</h4>
      <div className="stat-section">
        <div className="stat-cluster">
          {["defense", "plating", "padding"].map((stat) => (
            <StatSlot
              key={stat}
              stats={stats}
              stat={stat as StatName}
              baselineStats={baselineStats}
              remainingPoints={remainingPoints}
              handleClick={updateStats}
            />
          ))}
        </div>
        <div className="stat-cluster">
          {["resistance", "dampening", "warding"].map((stat) => (
            <StatSlot
              key={stat}
              stats={stats}
              stat={stat as StatName}
              baselineStats={baselineStats}
              remainingPoints={remainingPoints}
              handleClick={updateStats}
            />
          ))}
        </div>
      </div>
      <button disabled={remainingPoints !== 0} onClick={submitStats}>
        Confirm
      </button>
    </div>
  );
}
