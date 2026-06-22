import "./StatBar.css";
import { trunc } from "../../../server/utils/battle.ts";
import { ReactNode, useEffect } from "react";

function StatBar({
  id,
  maxStat,
  currentStat,
  stat,
  children,
}: {
  id: string;
  maxStat: number;
  currentStat: number;
  stat: "life" | "speed";
  children: ReactNode;
}) {
  const percentage = trunc((currentStat / maxStat) * 100);
  const chosenColor = (() => {
    if (percentage >= 66) {
      return stat === "life" ? "var(--lifeGreen)" : "var(--speedTeal)";
    } else if (percentage >= 33) {
      return stat === "life" ? "var(--lifeOrange)" : "var(--speedCyan)";
    } else {
      return stat === "life" ? "var(--lifeRed)" : "var(--speedPurple)";
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
      <div className="stat-blur">
        <span className="name-text">{children}</span>
      </div>
    </div>
  );
}

export default StatBar;
