import { atomWithStorage } from "jotai/utils";
import { MuiColors } from "../components/common/types";

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

export const BOTC_MIN_PLAYERS = 5;
export const BOTC_MAX_PLAYERS = 15;
const BOTC_MAX_TRAVELERS = 5;

export interface BotCState {
  isText: boolean;
  numPlayers: number;
  numTravelers: number;
  round: number;
  script: number;
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

const newPlayers: BotCPlayer[] = [];
for (let i = 0; i < BOTC_MAX_PLAYERS + BOTC_MAX_TRAVELERS; i += 1) {
  newPlayers.push({ ...botcPlayerShell });
}

const numRounds = [0, 1, 2, 3, 4, 5, 6, 7];
export const newRoundNotes = () => numRounds.map(() => "");
export const newTracker = () => numRounds.map(() => newPlayers.map(() => 0));

export const newBotCGame = (): BotCState => ({
  isText: true,
  numPlayers: 8,
  numTravelers: 0,
  round: 0,
  script: 0,
  botcPlayers: newPlayers,
  roundNotes: newRoundNotes(),
  tracker: newTracker(),
});

const botcAtom = atomWithStorage("botcAtom", newBotCGame());

export default botcAtom;
