import { useContext, useState } from "react";
import { StatName, StatsType } from "../../../types/individual/stats.ts";
import "./StatGrowth.css";
import { socket } from "../../socket.ts";
import { GameContext } from "../../contexts/GameContext.tsx";

type RemainingPointsType = { core: number; standard: number };
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
  remainingPoints: RemainingPointsType;
  handleClick: StatClickFnType;
}) => {
  const chosenStat = stats[stat];
  const isCore = stat === "hitPoints" || stat === "speed";
  const remaining = isCore ? remainingPoints.core : remainingPoints.standard;
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
        disabled={chosenStat >= 99 || remaining <= 0}
        onClick={() => handleClick(stat, true, isCore)}
      >
        +
      </button>
    </div>
  );
};

export function StatGrowth({
  id,
  corePoints,
  standardPoints,
}: {
  id: string;
  corePoints: number;
  standardPoints: number;
}) {
  const game = useContext(GameContext);
  const playerCharacters = game?.data.characters.players;
  const baselineStats =
    playerCharacters?.find((character) => character.id === id)?.stats ||
    initialStats;
  const [stats, setStats] = useState(baselineStats);
  const [remainingPoints, setRemainingPoints] = useState<RemainingPointsType>({
    core: corePoints,
    standard: standardPoints,
  });

  function updateStats(stat: StatName, add: boolean, core: boolean) {
    setStats({
      ...stats,
      [stat]: stats[stat] + (add ? 1 : -1),
    });
    setRemainingPoints(
      core
        ? {
            ...remainingPoints,
            core: remainingPoints.core - (add ? 1 : -1),
          }
        : {
            ...remainingPoints,
            standard: remainingPoints.standard - (add ? 1 : -1),
          },
    );
  }

  function submitStats() {
    socket.emit("character", stats);
  }

  return (
    <div className="stat-splash">
      <h3>
        CORE STATS ({remainingPoints.core} / {corePoints})
      </h3>
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
      <h3>
        OTHER STATS ({remainingPoints.standard} / {standardPoints})
      </h3>
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
      <button
        disabled={remainingPoints.core !== 0 || remainingPoints.standard !== 0}
        onClick={submitStats}
      >
        Confirm
      </button>
    </div>
  );
}
