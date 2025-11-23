export const randNum = (max: number) => Math.floor(Math.random() * max);
export const randEntry = (arr: unknown[]) => arr[randNum(arr.length)];
