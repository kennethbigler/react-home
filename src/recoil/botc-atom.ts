import { atom } from "recoil";
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
export const BOTC_MAX_TRAVELERS = 5;

export interface BotCState {
  script: number;
  numPlayers: number;
  numTravelers: number;
  botcPlayers: BotCPlayer[];
  isText: boolean;
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

const initBotCPlayers: BotCPlayer[] = [];
for (let i = 0; i < BOTC_MAX_PLAYERS + BOTC_MAX_TRAVELERS; i += 1) {
  initBotCPlayers.push({ ...botcPlayerShell });
}

const newBotCGame = () => ({
  script: 0,
  numPlayers: 8,
  numTravelers: 0,
  botcPlayers: initBotCPlayers,
  isText: true,
});

const botcAtom = atom({
  key: "botcAtom",
  default:
    (JSON.parse(localStorage.getItem("botc-atom") || "null") as BotCState) ||
    newBotCGame(),
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("botc-atom", JSON.stringify(state));
      });
    },
  ],
});

export default botcAtom;
