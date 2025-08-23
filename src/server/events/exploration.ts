import { PlayerType } from "../../types/individual/characters.ts";
import { GameType, RewardOptions } from "../../types/game.ts";

export const updateCharacter = (
  character: PlayerType,
  attribute: RewardOptions,
  game: GameType,
) => {
  const existingCharacters = game.characters as PlayerType[];
  const characterToOverride = existingCharacters.findIndex(
    (existingCharacter) => existingCharacter.id === character.id,
  );

  if (characterToOverride >= 0) {
    existingCharacters[characterToOverride] = character;
    game.rewards.pending[attribute] = 0;
  }

  return game;
};
