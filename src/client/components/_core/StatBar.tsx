import "./StatBar.css";
import { trunc } from "../../../server/utils/battle.ts";
import { useEffect } from "react";

function StatBar({
  id,
  maxStat,
  currentStat,
  stat,
}: {
  id: string;
  maxStat: number;
  currentStat: number;
  stat: "life" | "speed";
}) {
  const percentage = trunc((currentStat / maxStat) * 100);
  const chosenColor = (() => {
    if (percentage >= 66) {
      return "var(--hpGreen)";
    } else if (percentage >= 33) {
      return "var(--hpOrange)";
    } else {
      return "var(--hpRed)";
    }
  })();
  const statBarId = stat + "_" + id;

  useEffect(() => {
    const statBar = document.getElementById(statBarId);
    statBar?.style?.setProperty(`--${stat}-bg`, chosenColor);
    statBar?.style?.setProperty(`--${stat}-percent`, percentage + "%");
  }, [chosenColor, percentage, stat, statBarId]);

  return (
    <div id={statBarId} className={`stat-bar ${stat}-bar`}>
      <div>{currentStat}</div>
      <div>/</div>
      <div>{maxStat}</div>
    </div>
  );
}

export default StatBar;
