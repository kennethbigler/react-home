import { atomWithStorage } from "jotai/utils";
import {
  Mission,
  basic,
  getForcedMission,
} from "../constants/imperial-campaigns";

interface ImpAssState {
  /** all campaign stats will be recorded here */
  campaign: Mission[];
  /** only forced missions (often none) */
  forcedMissions: Mission[];
  /** Rebel's credits available to spend */
  credits: number;
  /** Rebel's xp available to spend */
  rebelXP: number[];
  /** Empire's xp available to spend */
  xp: number;
  /** Empire's Influence available to spend */
  influence: number;
}

/* TODO:
If Twin Shadows || The Bespin Gambit
  rebelXP = [3, 3, 3, 3], credits = 400, xp = 3
If Tyrants of Lothal
  rebelXP = [2, 2, 2, 2], credits = 300, xp = 2
*/
const newCampaignStats: Omit<ImpAssState, "campaign"> = {
  forcedMissions: [getForcedMission(2)],
  credits: 0,
  rebelXP: [0, 0, 0, 0],
  xp: 0,
  influence: 0,
};

const initialState: ImpAssState = {
  campaign: basic,
  ...newCampaignStats,
};

const impAssAtom = atomWithStorage("impAssAtom", initialState);

export default impAssAtom;
