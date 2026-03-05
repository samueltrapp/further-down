export const randNum = (max: number) => Math.floor(Math.random() * max);
export const randEntry = (arr: unknown[]) => {
  const index = randNum(arr.length);
  return {
    pick: arr[index],
    altered: [...arr].splice(index, 1),
  };
};
