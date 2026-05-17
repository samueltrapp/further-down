export const selectCharacters = (
  enemyId: string,
  selectedEnemies: string[],
  maxSelections: number,
) => {
  if (maxSelections === 0) {
    return [];
  }

  const isNew = !selectedEnemies.includes(enemyId);
  const isFull = selectedEnemies.length >= maxSelections;

  // Remove selected unit if already selected
  if (!isNew) {
    return selectedEnemies.filter((selectedEnemy) => selectedEnemy !== enemyId);
  }

  const existingSelections = !isFull
    ? selectedEnemies
    : selectedEnemies.slice(1);
  return [...existingSelections, enemyId];
};
