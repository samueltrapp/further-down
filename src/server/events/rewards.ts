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

      connection.gameMeta.games[gameIndex] = {
        ...game,
        characters: {
          ...game.characters,
          players: game.characters.players.splice(
            characterIndex,
            1,
            updatedCharacter,
          ),
        },
      };
      sendGame(connection, gameId);
    }
  }
}
