import { atom } from "jotai";
import persistentAtom from "./storage";
import {
  type Mission,
  basic,
  getForcedMission,
} from "../constants/imperial-campaigns";

interface ImpAssState {
  /** index of campaign to make sure selector matches */
  campaignIdx: string;
  /** all campaign stats will be recorded here */
  campaign: Mission[];
  /** only forced missions (often none) */
  forcedMissions: Mission[];
  /** Rebel's credits available to spend */
  credits: string;
  /** Rebel's xp available to spend */
  rebelXP: number[];
  /** Empire's xp available to spend */
  xp: number;
  /** Empire's Influence available to spend */
  influence: number;
}

const initialState: ImpAssState = {
  campaign: basic,
  campaignIdx: "0",
  forcedMissions: [getForcedMission(2)],
  credits: "0",
  rebelXP: [0, 0, 0, 0],
  xp: 0,
  influence: 0,
};

const impAssAtom = persistentAtom("impAssAtom", initialState);

/* Per-field read atoms so consumers subscribe only to the slice they render.
 * Each returns a stable reference until that field actually changes. */
const fieldAtom = <K extends keyof ImpAssState>(key: K) => {
  const anAtom = atom((get) => get(impAssAtom)[key]);
  anAtom.debugLabel = `impAssAtom.${key}`;
  return anAtom;
};

export const impAssCampaignIdxAtom = fieldAtom("campaignIdx");
export const impAssCampaignAtom = fieldAtom("campaign");
export const impAssForcedMissionsAtom = fieldAtom("forcedMissions");
export const impAssCreditsAtom = fieldAtom("credits");
export const impAssRebelXPAtom = fieldAtom("rebelXP");
export const impAssXPAtom = fieldAtom("xp");
export const impAssInfluenceAtom = fieldAtom("influence");

export default impAssAtom;
