import { atom } from "recoil";
import { MuiColors } from "../components/common/types";

export interface BotCPlayer {
  name: string;
  roles: string[];
  notes: string;
  liar: boolean;
  dead: boolean;
  used: boolean;
  alignment: MuiColors;
}

export const BOTC_MIN_PLAYERS = 5;
export const BOTC_MAX_PLAYERS = 20;

export interface BotCState {
  script: number;
  numPlayers: number;
  botcPlayers: BotCPlayer[];
}

export const botcPlayerShell: BotCPlayer = {
  name: "Ken",
  roles: [],
  notes: "",
  liar: false,
  dead: false,
  used: false,
  alignment: "primary",
};

const initBotcPlayers: BotCPlayer[] = [];
for (let i = 0; i < BOTC_MAX_PLAYERS; i += 1) {
  initBotcPlayers.push(botcPlayerShell);
}

export const newBotcGame = () => ({
  script: 0,
  numPlayers: 8,
  botcPlayers: initBotcPlayers,
});

const botcAtom = atom({
  key: "botcAtom",
  default:
    (JSON.parse(localStorage.getItem("botc-atom") || "null") as BotCState) ||
    newBotcGame(),
  effects: [
    ({ onSet }) => {
      onSet((state) => {
        localStorage.setItem("botc-atom", JSON.stringify(state));
      });
    },
  ],
});

export default botcAtom;
