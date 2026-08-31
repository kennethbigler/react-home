import { atom } from "jotai";
import persistentAtom from "./storage";
import type { MuiColors } from "../@types/mui";

export type BotCPlayerStatus = "liar" | "used" | "exec" | "kill";

export interface BotCRole {
  name: string;
  icon: string;
  alignment: MuiColors;
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

export const BaseScript = {
  TB: 0,
  SNV: 1,
  BMR: 2,
  Other: 3,
} as const;

export type BaseScriptIndex = (typeof BaseScript)[keyof typeof BaseScript];

export type ActiveScript =
  | { type: "base"; index: BaseScriptIndex }
  | {
      type: "community";
      pk: number;
      title: string;
      author: string;
      characters: string[];
    };

export const BOTC_MIN_PLAYERS = 5;
export const BOTC_MAX_PLAYERS = 15;
export const BOTC_MAX_TRAVELERS = 5;

export interface BotCState {
  isText: boolean;
  numPlayers: number;
  numTravelers: number;
  round: number;
  script: ActiveScript;
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
const NUM_ROUNDS = 8;

export const newRoundNotes = () => new Array<string>(NUM_ROUNDS).fill("");
export const newTracker = () =>
  Array.from({ length: NUM_ROUNDS }, () =>
    Array<number>(BOTC_TOTAL_SLOTS).fill(0),
  );

export const newBotCGame = (): BotCState => ({
  isText: true,
  numPlayers: 8,
  numTravelers: 0,
  round: 0,
  script: { type: "base", index: BaseScript.TB },
  botcPlayers: Array.from({ length: BOTC_TOTAL_SLOTS }, () => ({
    ...botcPlayerShell,
  })),
  roundNotes: newRoundNotes(),
  tracker: newTracker(),
});

const botcAtom = persistentAtom("botcAtom_v2", newBotCGame());

/* Per-field read atoms so consumers subscribe only to the slice they render.
 * Each returns a stable reference until that field actually changes. */
const fieldAtom = <K extends keyof BotCState>(key: K) => {
  const anAtom = atom((get) => get(botcAtom)[key]);
  anAtom.debugLabel = `botcAtom.${key}`;
  return anAtom;
};

export const botcIsTextAtom = fieldAtom("isText");
export const botcNumPlayersAtom = fieldAtom("numPlayers");
export const botcNumTravelersAtom = fieldAtom("numTravelers");
export const botcScriptAtom = fieldAtom("script");
export const botcPlayersAtom = fieldAtom("botcPlayers");
export const botcRoundAtom = fieldAtom("round");
export const botcRoundNotesAtom = fieldAtom("roundNotes");
export const botcTrackerAtom = fieldAtom("tracker");

export default botcAtom;
