import {
  ManeuverName,
  OtherManeuverFnArgsType,
  SelfManeuverFnArgsType,
} from "../../types/maneuvers.ts";
import { slapOther, slapSelf } from "./mnvFns/slap.ts";
import { CharType } from "../../types/characters.ts";
import { quicksilverOther, quicksilverSelf } from "./mnvFns/quicksilver.ts";
import { acheOther, acheSelf } from "./mnvFns/ache.ts";
import { fireburstOther, fireburstSelf } from "./mnvFns/fireburst.ts";

type OtherManeuverFnType = (fnArgs: OtherManeuverFnArgsType) => {
  character: CharType;
  logMessages: string[];
};

type SelfManeuverFnType = (fnArgs: SelfManeuverFnArgsType) => {
  character: CharType;
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
