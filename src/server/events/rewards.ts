import { sendGame } from "./gameManagement.ts";
import { ConnectionType } from "../../types/server.ts";
import { SkillType } from "../../types/events/skill.ts";
import { PlayerType } from "../../types/individual/characters.ts";

export function takeReward(
  connection: ConnectionType,
  { rewardOption, rewardName, gameId, characterId }: SkillType,
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(gameId);
  if (game) {
    const existingCharacters = game.characters.players;
    const characterIndex = existingCharacters.findIndex(
      (existingCharacter) => existingCharacter.id === characterId,
    );

    if (characterIndex >= 0) {
      const character = existingCharacters[characterIndex];
      const updatedCharacter: PlayerType = {
        ...character,
        rewards: {
          ...character.rewards,
          [rewardOption]: [...character.rewards[rewardOption], rewardName],
        },
        pendingRewards: {
          ...character.pendingRewards,
          [rewardOption]: character.pendingRewards[rewardOption] - 1,
        },
      };

      /* TS refuses to understand this method even after updating the compiler options */
      // @ts-ignore
      const q: PlayerType[] = game.characters.players.toSpliced(
        characterIndex,
        1,
        updatedCharacter,
      );

      console.log(game.characters.players);
      console.log(characterIndex);
      console.log(updatedCharacter);

      connection.gameMeta.games[gameIndex] = {
        ...game,
        characters: {
          ...game.characters,
          players: q,
        },
      };
      sendGame(connection, gameId);
    }
  }
}
