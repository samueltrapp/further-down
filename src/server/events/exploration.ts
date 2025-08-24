import {
  PlayerType,
  RewardOptions,
} from "../../types/individual/characters.ts";
import { GameType } from "../../types/game.ts";

export const updateCharacter = (
  character: PlayerType,
  rewardSlot: RewardOptions,
  game: GameType,
) => {
  const existingCharacters = game.characters.players;
  const characterToOverride = existingCharacters.findIndex(
    (existingCharacter) => existingCharacter.id === character.id,
  );

  if (characterToOverride >= 0) {
    existingCharacters[characterToOverride] = character;
    game.characters.players[characterToOverride].pendingRewards[rewardSlot] = 0;
  }

  return game;
};
