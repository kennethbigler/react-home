import indigo from '@material-ui/core/colors/indigo';
import deepOrange from '@material-ui/core/colors/deepOrange';
import { pullHandle } from '../apis/SlotMachine';

import {
  DBDota2Phase, DBDota2Turn, DBGit, DBPlayer,
  DBUITheme, DBTurn, DBRootState, DBSlotDisplay,
} from './types';

// --------------------     helpers     -------------------- //
export const newPlayer = (id: number, name = 'Bot', isBot = true): DBPlayer => ({
  id,
  name,
  isBot,
  status: '',
  money: 100,
  bet: 5,
  hands: [],
});

const newDota2Phase = (name: string, radiant: DBDota2Turn, dire: DBDota2Turn): DBDota2Phase => ({
  name, radiant: { ...radiant }, dire: { ...dire },
});

export const newDota2Lineup = (): DBDota2Phase[] => [...[
  newDota2Phase('Ban 1', { number: 1 }, { number: 2 }),
  newDota2Phase('Ban 2', { number: 3 }, { number: 4 }),
  newDota2Phase('Ban 3', { number: 5 }, { number: 6 }),
  newDota2Phase('Pick 1', { number: 7 }, { number: 8 }),
  newDota2Phase('Pick 2', { number: 10 }, { number: 9 }),
  newDota2Phase('Ban 4', { number: 11 }, { number: 12 }),
  newDota2Phase('Ban 5', { number: 13 }, { number: 14 }),
  newDota2Phase('Pick 3', { number: 16 }, { number: 15 }),
  newDota2Phase('Pick 4', { number: 18 }, { number: 17 }),
  newDota2Phase('Ban 6', { number: 20 }, { number: 19 }),
  newDota2Phase('Pick 5', { number: 21 }, { number: 22 }),
]];

// --------------------     initial state     -------------------- //
const dota2 = [newDota2Lineup()];
const git: DBGit = {
  storyID: '',
  branchMessage: '',
  branchPrefix: 'features',
  casePreference: 'snake_case',
  commitPrefix: true,
};
const gqlToken = '';
const players: DBPlayer[] = [
  newPlayer(1, 'Ken', false),
  newPlayer(2),
  newPlayer(3),
  newPlayer(4),
  newPlayer(5),
  newPlayer(6),
  newPlayer(0, 'Dealer', true),
];
const slots: DBSlotDisplay[] = pullHandle();
const theme: DBUITheme = {
  primary: indigo,
  secondary: deepOrange,
  type: 'dark',
};
const turn: DBTurn = { player: 0, hand: 0 };
const yahtzee: number[] = [];

export default {
  dota2,
  git,
  gqlToken,
  players,
  slots,
  theme,
  turn,
  yahtzee,
} as DBRootState;
