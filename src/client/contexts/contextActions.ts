import { GameClientType } from "./ContextTypes.ts";

export const selectEnemies = (
  newSelection: string | null,
  clientState: GameClientType,
) => {
  if (!newSelection) return [];
  const pivot = clientState.selectedEnemyIds.findIndex(
    (enemyId: string) => enemyId === newSelection,
  );
  if (pivot >= 0) {
    return clientState.selectedEnemyIds
      .slice(0, pivot)
      .concat(clientState.selectedEnemyIds.slice(pivot + 1));
  }
  const overwriteIndex =
    clientState.maxEnemySelections > 1
      ? -(clientState.maxEnemySelections - 1)
      : clientState.selectedEnemyIds.length;
  const needsOverwrite =
    clientState.selectedEnemyIds.length >= clientState.maxEnemySelections;
  const limitedEnemyIds = clientState.selectedEnemyIds.slice(
    needsOverwrite ? overwriteIndex : 0,
  );
  limitedEnemyIds.push(newSelection);
  return limitedEnemyIds;
};
