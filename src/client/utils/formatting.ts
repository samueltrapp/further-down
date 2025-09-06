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
