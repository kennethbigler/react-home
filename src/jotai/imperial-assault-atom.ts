import { atomWithStorage } from "jotai/utils";
import {
  Mission,
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

const impAssAtom = atomWithStorage("impAssAtom", initialState);

export default impAssAtom;
