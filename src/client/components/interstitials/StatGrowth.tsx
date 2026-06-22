import { useEffect, useState } from "react";
import { StatsType } from "../../../types/individual/stats.ts";
import { StatCategory } from "../../../types/events/skill.ts";
import "./StatGrowth.css";
import { takeStats } from "../../services/skill.ts";
import { PlayerType } from "../../../types/individual/characters.ts";

type StatClickFnType = (stat: string, add: boolean) => void;

const StatSlot = ({
  chosenStat,
  baseline,
  stat,
  remainingPoints,
  handleClick,
}: {
  chosenStat: number;
  baseline: number;
  stat: string;
  remainingPoints: number;
  handleClick: StatClickFnType;
}) => (
  <div>
    {stat.toUpperCase()}
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

export function StatGrowth({
  points,
  category,
  gameId,
  character,
}: {
  points: number;
  category: StatCategory;
  gameId: string;
  character: PlayerType;
}) {
  const baselineStats = character?.stats;
  const [categoryStats, setCategoryStats] = useState(() => ({
    ...(baselineStats[category] as Record<string, number>),
  }));
  const [remainingPoints, setRemainingPoints] = useState(points);

  useEffect(() => {
    setRemainingPoints(points);
    setCategoryStats({ ...baselineStats[category] });
  }, [points, category, baselineStats]);

  function updateStats(stat: string, add: boolean) {
    setCategoryStats({
      ...categoryStats,
      [stat]: categoryStats[stat] + (add ? 1 : -1),
    });
    setRemainingPoints(remainingPoints - (add ? 1 : -1));
  }

  function submitStats() {
    const newStats: StatsType = {
      ...baselineStats,
      [category]: categoryStats,
    };
    takeStats({ newStats, category, gameId, characterId: character.id });
  }

  /* Slot factory scoped to the active category */
  const slot = (stat: string) => ({
    key: stat,
    stat,
    chosenStat: categoryStats[stat],
    baseline: (baselineStats[category] as Record<string, number>)[stat],
    remainingPoints,
    handleClick: updateStats,
  });

  const coreSlots = ["vitality", "initiative"];
  const disciplineSlots = [
    ["martial", "defense", "accuracy", "evasion"],
    ["mystic", "resistance", "control", "negation"],
  ];
  const masterySlots = [
    ["bladed", "blunt", "plating", "padding"],
    ["elemental", "psychic", "dampening", "warding"],
  ];

  return (
    <div className="stat-splash">
      <h2>{category.toUpperCase()}</h2>
      <h3>Remaining Points: {remainingPoints}</h3>

      {category === "core" && (
        <div className="stat-column w100">
          {coreSlots.map((stat) => (
            <StatSlot {...slot(stat)} />
          ))}
        </div>
      )}

      {category === "discipline" && (
        <div className="stat-cluster w100">
          {disciplineSlots.map((division) => (
            <div key={division[0]} className="stat-column">
              {division.map((stat) => (
                <StatSlot {...slot(stat)} />
              ))}
            </div>
          ))}
        </div>
      )}

      {category === "mastery" && (
        <div className="stat-cluster w100">
          {masterySlots.map((division) => (
            <div key={division[0]} className="stat-column">
              {division.map((stat) => (
                <StatSlot {...slot(stat)} />
              ))}
            </div>
          ))}
        </div>
      )}

      <button disabled={remainingPoints !== 0} onClick={submitStats}>
        Confirm
      </button>
    </div>
  );
}
