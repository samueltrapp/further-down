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
      <div className="dt-panel-controls">
        <button
          className={classes("stats")}
          onClick={() => setDetailOption("stats")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <path
              fill="#FFFFFF"
              d="M18 3v2H2V3h16zm-6 4v2H2V7h10zm6 0v2h-4V7h4zM8 11v2H2v-2h6zm10 0v2h-8v-2h8zm-4 4v2H2v-2h12z"
            ></path>
          </svg>
        </button>
        <button
          className={classes("maneuvers")}
          onClick={() => setDetailOption("maneuvers")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="#FFFFFF"
              d="m7.048 13.406l3.535 3.536l-1.413 1.414l1.415 1.415l-1.414 1.414l-2.475-2.475l-2.829 2.829l-1.414-1.414l2.829-2.83l-2.475-2.474l1.414-1.414l1.414 1.413l1.413-1.414ZM3 3l3.546.003l11.817 11.818l1.415-1.414l1.415 1.414l-2.475 2.475l2.828 2.829l-1.414 1.414l-2.829-2.829l-2.474 2.475l-1.415-1.414l1.414-1.415L3.002 6.531L2.999 3Zm14.457 0L21 3.003l.002 3.523l-4.053 4.052l-3.536-3.535L17.456 3Z"
            ></path>
          </svg>
        </button>
        <button
          className={classes("equipment")}
          onClick={() => setDetailOption("equipment")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="#FFFFFF"
              d="M16 9c4 2 5 9 5 9s1 4-5 4H8c-6 0-5-4-5-4s1-7 5-9m6-5l-2-2l-2 2l-4-2l2 5h8l2-5l-4 2Z"
            ></path>
          </svg>
        </button>
        <button
          className={classes("effects")}
          onClick={() => setDetailOption("effects")}
        >
          <svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="#FFFFFF"
              d="M11.191.565c.275-.754 1.342-.753 1.618 0l1.918 5.238a5.83 5.83 0 0 0 3.47 3.47l5.237 1.918c.755.275.755 1.342 0 1.618l-5.237 1.918a5.83 5.83 0 0 0-3.47 3.47l-1.918 5.237c-.276.755-1.343.755-1.618 0l-1.918-5.237a5.83 5.83 0 0 0-3.47-3.47L.565 12.809c-.753-.276-.754-1.342 0-1.618l5.238-1.918a5.83 5.83 0 0 0 3.47-3.47zm-.505 5.756a7.34 7.34 0 0 1-4.365 4.365L2.73 12l3.591 1.315a7.33 7.33 0 0 1 4.365 4.365L12 21.269l1.315-3.589a7.33 7.33 0 0 1 4.365-4.365L21.269 12l-3.589-1.314a7.33 7.33 0 0 1-4.365-4.365L12 2.73z"
            ></path>
          </svg>
        </button>
      </div>
      <InternalPanel character={character} detailOption={detailOption} />
    </aside>
  );
}
