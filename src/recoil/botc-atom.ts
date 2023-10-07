import { atom } from "recoil";

export interface BotCPlayer {
  name: string;
  roles: string[];
  liar: boolean;
  dead: boolean;
  used: boolean;
}

export const BOTC_MIN_PLAYERS = 5;
export const BOTC_MAX_PLAYERS = 20;

export interface BotCState {
  script: number;
  numPlayers: number;
  botcPlayers: BotCPlayer[];
}

const botcPlayerShell: BotCPlayer = {
  name: "Ken",
  roles: [],
  liar: false,
  dead: false,
  used: false,
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
