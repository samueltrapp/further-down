import "./DetailPanel.css";
import { useGame } from "../../../hooks/useGame.ts";

function DetailPanel() {
  const { game } = useGame();
  const characters = game?.data?.characters;
  const detailId = game?.client?.detailId || game?.data?.battle?.turnOrder[0];

  if (!characters || !detailId) {
    return null;
  }

  const dtlChar = characters[detailId];
  const stats = dtlChar?.stats;
  // const effects = dtlChar?.effects;

  return (
    <section className="dt-panel-wrapper">
      <div className="dt-name fs2">{dtlChar.name}</div>
      <div className="dt-panel-container">
        <div className="dt-col">
          <DetailEntry
            statName={"Life"}
            statValue={stats.life}
            maxStatValue={stats.maxLife}
          />
          <DetailEntry
            statName={"Speed"}
            statValue={stats.speed}
            maxStatValue={stats.maxSpeed}
          />
          <DetailEntry statName={"Physical"} statValue={stats.physical} />
          <DetailEntry statName={"Magical"} statValue={stats.magical} />
          <DetailEntry statName={"Defense"} statValue={stats?.defense} />
          <DetailEntry statName={"Resistance"} statValue={stats?.resistance} />
        </div>
        <div className="dt-col">
          <DetailEntry statName={"Bladed"} statValue={stats?.bladed} />
          <DetailEntry statName={"Blunt"} statValue={stats?.blunt} />
          <DetailEntry statName={"Elemental"} statValue={stats?.elemental} />
          <DetailEntry statName={"Psychic"} statValue={stats?.psychic} />
          <DetailEntry statName={"Plating"} statValue={stats?.plating} />
          <DetailEntry statName={"Padding"} statValue={stats?.padding} />
          <DetailEntry statName={"Dampening"} statValue={stats?.dampening} />
          <DetailEntry statName={"Warding"} statValue={stats?.warding} />
        </div>
      </div>
    </section>
  );
}

function DetailEntry({
  statName,
  statValue,
  maxStatValue,
}: {
  statName: string;
  statValue: number;
  maxStatValue?: number;
}) {
  return (
    <div className="dt-entry">
      <span className="dt-label fs1">{statName}</span>
      <span className="dt-val fs1">{`${statValue}${maxStatValue ? ` / ${maxStatValue}` : ""}`}</span>
    </div>
  );
}

export default DetailPanel;
