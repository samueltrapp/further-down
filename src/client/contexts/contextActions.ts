export const selectEnemies = (
  enemyId: string,
  selectedEnemies: string[],
  maxEnemySelections: number,
) => {
  const isNew = !selectedEnemies.includes(enemyId);
  const isFull = selectedEnemies.length >= maxEnemySelections;

  if (isNew) {
    if (!isFull) {
      return [...selectedEnemies, enemyId];
    } else {
      return [...selectedEnemies.slice(1), enemyId];
    }
  } else {
    return selectedEnemies.filter((selectedEnemy) => selectedEnemy !== enemyId);
  }
};
