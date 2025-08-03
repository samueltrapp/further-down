/*
    Numbers: 48 - 57
    Caps: 65 - 90,
    Lower: 97-122
*/
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
