import { atomWithStorage } from "jotai/utils";
import { MuiColors } from "../components/common/types";

export type BotCPlayerStatus = "liar" | "used" | "exec" | "kill";

export interface BotCRole {
  name: string;
  icon: string;
  alignment: MuiColors;
  description?: string;
}

export interface BotCPlayer {
  name: string;
  roles: BotCRole[];
  notes: string;
  liar: boolean;
  used: boolean;
  exec: boolean;
  kill: boolean;
}

export type BuiltinScriptIndex = 0 | 1 | 2 | 3; // TB=0, SNV=1, BMR=2, Other=3

export type ActiveScript =
  | { type: "builtin"; index: BuiltinScriptIndex }
  | {
      type: "community";
      pk: number;
      title: string;
      author: string;
      characters: string[];
    };

export const BOTC_MIN_PLAYERS = 5;
export const BOTC_MAX_PLAYERS = 15;
const BOTC_MAX_TRAVELERS = 5;

export interface BotCState {
  isText: boolean;
  numPlayers: number;
  numTravelers: number;
  round: number;
  activeScript: ActiveScript;
  botcPlayers: BotCPlayer[];
  roundNotes: string[];
  tracker: number[][];
}

export const botcPlayerShell: BotCPlayer = {
  name: "Ken",
  roles: [],
  notes: "",
  liar: false,
  used: false,
  exec: false,
  kill: false,
};

const BOTC_TOTAL_SLOTS = BOTC_MAX_PLAYERS + BOTC_MAX_TRAVELERS;

const numRounds = [0, 1, 2, 3, 4, 5, 6, 7];
export const newRoundNotes = () => numRounds.map(() => "");
export const newTracker = () =>
  numRounds.map(() => Array<number>(BOTC_TOTAL_SLOTS).fill(0));

export const newBotCGame = (): BotCState => {
  const botcPlayers: BotCPlayer[] = [];
  for (let i = 0; i < BOTC_TOTAL_SLOTS; i += 1) {
    botcPlayers.push({ ...botcPlayerShell });
  }
  return {
    isText: true,
    numPlayers: 8,
    numTravelers: 0,
    round: 0,
    activeScript: { type: "builtin", index: 0 },
    botcPlayers,
    roundNotes: newRoundNotes(),
    tracker: newTracker(),
  };
};

const botcAtom = atomWithStorage("botcAtom_v2", newBotCGame());

export default botcAtom;
