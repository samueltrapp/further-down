import {GameType, TurnType} from "../../types/game.ts";
import {mnvSlap} from "./maneuvers/slap.ts";

type ManeuverFnType = (game: GameType, issuerId: string, targetIds: string[]) => GameType;

const maneuverMap = new Map<string, ManeuverFnType>;
maneuverMap.set("slap", mnvSlap);

export function resolveTurn(turn: TurnType, game: GameType): GameType {
    const { maneuver, issuerId, targetIds } = turn;
    return (maneuverMap.get(maneuver) as ManeuverFnType).call({}, game, issuerId, targetIds);
}
