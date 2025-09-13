/*
    Numbers: 48 - 57
    Caps: 65 - 90,
    Lower: 97-122
*/
import { SingleRewardType } from "../../types/equipables/aggregates.ts";

export const randomId = (digits: number = 5) => {
  const id = [];
  while (id.length < digits) {
    const pick = Math.floor(Math.random() * 62);
    if (pick < 10) {
      id.push(String.fromCharCode(pick + 48));
    } else if (pick < 36) {
      id.push(String.fromCharCode(pick + 55));
    } else {
      id.push(String.fromCharCode(pick + 61));
    }
  }
  return id.join("");
};

export const randomizeCollection = (collection: SingleRewardType) => {
  const copy = [...collection];
  for (let orderedIndex = copy.length - 1; orderedIndex > 0; orderedIndex--) {
    const randomIndex = Math.floor(Math.random() * (orderedIndex + 1));
    [copy[orderedIndex], copy[randomIndex]] = [
      copy[randomIndex],
      copy[orderedIndex],
    ];
  }
  return copy;
};
