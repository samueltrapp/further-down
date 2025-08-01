export const createSpread = (spread: number) => {
  const rand = Math.random();
  return (Math.floor(rand * 10) % 2 === 0 ? 1 : -1) * Math.round(rand * spread);
};
