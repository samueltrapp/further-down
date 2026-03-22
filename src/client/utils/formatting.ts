export const toCaps = (words: string) => {
  const dividedWords = words.split(/\s+/);
  const capitalizedWords = dividedWords.map(
    (word) => word[0].toUpperCase() + word.slice(1),
  );
  return capitalizedWords.join(" ");
};

export const contextualIndefinite = (consequent: string) => {
  const vowels = ["a", "e", "i", "o", "u"];
  return vowels.includes(consequent.charAt(0).toLowerCase()) ? "an" : "a";
};

export const singularize = (word: string) =>
  word.endsWith("s") ? word.substring(0, word.length - 1) : word;

export const cdcl = (
  ...conditionalClass: ({ [key: string]: boolean | undefined } | string)[]
) => {
  let classList = "";
  conditionalClass.forEach((item) => {
    if (typeof item === "string") {
      classList += ` ${item}`;
    } else {
      const entry = Object.entries(item);
      if (entry[1]) {
        classList += ` ${entry[0]}`;
      }
    }
  });
  return classList.trim();
};
