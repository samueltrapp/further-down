import { ManeuverName } from "../../types/maneuvers.ts";
import { slapOther, slapSelf } from "./mnvFns/slap.ts";
import { CharType } from "../../types/characters.ts";

type OtherManeuverFnType = (
  recipient: CharType,
  actor: CharType,
  maneuver: ManeuverName,
) => { character: CharType; logMessages: string[] };

type SelfManeuverFnType = (
  self: CharType,
  maneuver: ManeuverName,
) => { character: CharType; logMessages?: string[] };

type CharacterEffectsType = {
  other: OtherManeuverFnType;
  self: SelfManeuverFnType;
};

const maneuverMap = new Map<ManeuverName, CharacterEffectsType>();
maneuverMap.set("slap", { other: slapOther, self: slapSelf });

export const getMnvFns = (maneuver: ManeuverName) => maneuverMap.get(maneuver);
