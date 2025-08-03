import { BattleStateType } from "./BattleContext.tsx";

export const selectEnemies = (
  newSelection: string | null,
  game: BattleStateType,
) => {
  if (!newSelection) return [];
  const pivot = game.selectedEnemyIds.findIndex(
    (enemyId) => enemyId === newSelection,
  );
  if (pivot >= 0) {
    return game.selectedEnemyIds
      .slice(0, pivot)
      .concat(game.selectedEnemyIds.slice(pivot + 1));
  }
  const overwriteIndex =
    game.maxEnemySelections > 1
      ? -(game.maxEnemySelections - 1)
      : game.selectedEnemyIds.length;
  const needsOverwrite =
    game.selectedEnemyIds.length >= game.maxEnemySelections;
  const limitedEnemyIds = game.selectedEnemyIds.slice(
    needsOverwrite ? overwriteIndex : 0,
  );
  limitedEnemyIds.push(newSelection);
  return limitedEnemyIds;
};
