export const toCaps = (words: string) => {
  const dividedWords = words.split(/\s+/);
  const capitalizedWords = dividedWords.map(
    (word) => word[0].toUpperCase() + word.slice(1),
  );
  return capitalizedWords.join(" ");
};
