import "./DetailsPanel.css";
import { useState } from "react";
import StatsPanel from "./StatsPanel.tsx";
import ManeuversPanel from "./ManeuversPanel.tsx";
import EquipmentPanel from "./EquipmentPanel.tsx";
import EffectsPanel from "./EffectsPanel.tsx";
import { DetailOptions } from "../../../../types/game.ts";
import {
  EnemyType,
  PlayerType,
} from "../../../../types/individual/characters.ts";

function InternalPanel({
  character,
  detailOption,
}: {
  character: PlayerType | EnemyType;
  detailOption: DetailOptions;
}) {
  switch (detailOption) {
    case "stats":
      return <StatsPanel character={character} />;
    case "maneuvers":
      return <ManeuversPanel character={character} />;
    case "equipment":
      return <EquipmentPanel character={character} />;
    case "effects":
      return <EffectsPanel character={character} />;
    default:
      return null;
  }
}

export default function DetailsPanel({
  character,
}: {
  character: PlayerType | EnemyType | null;
}) {
  const [detailOption, setDetailOption] = useState<DetailOptions>("stats");
  const classes = (currentOption: DetailOptions) =>
    currentOption === detailOption ? "panel-btn panel-btn-active" : "panel-btn";

  if (!character) {
    return <div />;
  }

  return (
    <aside className="dt-panel">
      <div className="var-panel">
        <button
          className={classes("stats")}
          onClick={() => setDetailOption("stats")}
        >
          S
        </button>
        <button
          className={classes("maneuvers")}
          onClick={() => setDetailOption("maneuvers")}
        >
          M
        </button>
        <button
          className={classes("equipment")}
          onClick={() => setDetailOption("equipment")}
        >
          E
        </button>
        <button
          className={classes("effects")}
          onClick={() => setDetailOption("effects")}
        >
          F
        </button>
      </div>
      <InternalPanel character={character} detailOption={detailOption} />
    </aside>
  );
}
