import {CharactersType} from "../../../types/game.ts";
import {WeaponType} from "../../../types/equipables/weapons.ts";

export type ActionCtx = {
    characters: CharactersType;
    sourceId: string;
    friendlyTargetIds: string[] | undefined;
    enemyTargetIds: string[] | undefined;
    weapon: WeaponType;
    speed: number;
};

export type StepCtx = ActionCtx & {
    messages: string[];
    damage: number;
    mitigation: Map<string, number>;
    heal: number;
};