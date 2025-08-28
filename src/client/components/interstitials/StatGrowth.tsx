import { useContext, useState } from "react";
import { StatName, StatsType } from "../../../types/individual/stats.ts";
import "./StatGrowth.css";
import { socket } from "../../socket.ts";
import { GameContext } from "../../contexts/GameContext.tsx";

type StatClickFnType = (stat: StatName, add: boolean, core: boolean) => void;

const initialStats: StatsType = {
  currentHitPoints: 0,
  hitPoints: 0,
  vitality: 20,
  speedCapacity: 20,
  speed: 20,
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
  const isCore = stat === "hitPoints" || stat === "speed";
  const baseline = baselineStats[stat];

  return (
    <div>
      {stat === "hitPoints" ? "HIT POINTS" : stat.toUpperCase()}
      <button
        disabled={chosenStat <= baseline}
        onClick={() => handleClick(stat, false, isCore)}
      >
        -
      </button>
      {chosenStat}
      <button
        disabled={chosenStat >= 99 || remainingPoints <= 0}
        onClick={() => handleClick(stat, true, isCore)}
      >
        +
      </button>
    </div>
  );
};

export function StatGrowth({ id, points }: { id: string; points: number }) {
  const game = useContext(GameContext);
  const playerCharacters = game?.data.characters.players;
  const baselineStats =
    playerCharacters?.find((character) => character.id === id)?.stats ||
    initialStats;
  const [stats, setStats] = useState(baselineStats);
  const [remainingPoints, setRemainingPoints] = useState(points);

  function updateStats(stat: StatName, add: boolean) {
    setStats({
      ...stats,
      [stat]: stats[stat] + (add ? 1 : -1),
    });
    setRemainingPoints(points - (add ? 1 : -1));
  }

  function submitStats() {
    socket.emit("character", stats);
  }

  return (
    <div className="stat-splash">
      <h3>CORE STATS</h3>
      <div className="stat-cluster core">
        {["hitPoints", "speed"].map((stat) => (
          <StatSlot
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
