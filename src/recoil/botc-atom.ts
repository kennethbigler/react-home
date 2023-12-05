import { atom } from "recoil";
import { MuiColors } from "../components/common/types";

export interface BotCRole {
  name: string;
  alignment: MuiColors;
}

interface BotCPlayerShell {
  name: string;
  roles: BotCRole[];
  notes: string;
  liar: boolean;
  dead: boolean;
  used: boolean;
}

export interface BotCPlayer {
  name: string;
  roles: BotCRole[];
  notes: string;
  liar: boolean;
  dead: boolean;
  used: boolean;
  id: number;
}

export const BOTC_MIN_PLAYERS = 5;
export const BOTC_MAX_PLAYERS = 15;
export const BOTC_MAX_TRAVELERS = 5;

export interface BotCState {
  script: number;
  numPlayers: number;
  numTravelers: number;
  botcPlayers: BotCPlayer[];
}

export const botcPlayerShell: BotCPlayerShell = {
  name: "Ken",
  roles: [],
  notes: "",
  liar: false,
  dead: false,
  used: false,
};

const initBotCPlayers: BotCPlayer[] = [];
for (let i = 0; i < BOTC_MAX_PLAYERS + BOTC_MAX_TRAVELERS; i += 1) {
  initBotCPlayers.push({ ...botcPlayerShell, id: i });
}

const newBotCGame = () => ({
  script: 0,
  numPlayers: 8,
  numTravelers: 0,
  botcPlayers: initBotCPlayers,
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
