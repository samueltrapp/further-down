export const selectCharacters = (
  enemyId: string,
  selectedEnemies: string[],
  maxSelections: number,
) => {
  const isNew = !selectedEnemies.includes(enemyId);
  const isFull = selectedEnemies.length >= maxSelections;

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
