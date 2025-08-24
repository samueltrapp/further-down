import {
  ManeuverName,
  OtherManeuverFnArgsType,
  SelfManeuverFnArgsType,
} from "../../../types/equipables/maneuvers.ts";
import { slapOther, slapSelf } from "./collection/slap.ts";
import { EnemyType, PlayerType } from "../../../types/individual/characters.ts";
import { quicksilverOther, quicksilverSelf } from "./collection/quicksilver.ts";
import { acheOther, acheSelf } from "./collection/ache.ts";
import { fireburstOther, fireburstSelf } from "./collection/fireburst.ts";

type OtherManeuverFnType = (fnArgs: OtherManeuverFnArgsType) => {
  character: EnemyType;
  logMessages: string[];
};

type SelfManeuverFnType = (fnArgs: SelfManeuverFnArgsType) => {
  character: PlayerType;
  logMessages?: string[];
};

type CharacterEffectsType = {
  other: OtherManeuverFnType;
  self: SelfManeuverFnType;
};

const maneuverMap = new Map<ManeuverName, CharacterEffectsType>();
maneuverMap.set("slap", { other: slapOther, self: slapSelf });
maneuverMap.set("quicksilver", {
  other: quicksilverOther,
  self: quicksilverSelf,
});
maneuverMap.set("fireburst", { other: fireburstOther, self: fireburstSelf });
maneuverMap.set("ache", { other: acheOther, self: acheSelf });

export const getMnvFns = (maneuver: ManeuverName) => maneuverMap.get(maneuver);
