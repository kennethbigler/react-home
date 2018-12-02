import assign from 'lodash/assign';
import blueGrey from '@material-ui/core/colors/blueGrey';
import deepOrange from '@material-ui/core/colors/deepOrange';

export const newPlayer = (id, name = 'Bot', isBot = true) => ({
  id,
  name,
  isBot,
  status: '',
  money: 100,
  bet: 5,
  hands: [],
});

export const newDota2Lineup = () => [...[
  assign({}, { name: 'Ban 1', radiant: assign({}, { number: 1, selection: null }), dire: assign({}, { number: 2, selection: null }) }),
  assign({}, { name: 'Ban 2', radiant: assign({}, { number: 3, selection: null }), dire: assign({}, { number: 4, selection: null }) }),
  assign({}, { name: 'Ban 3', radiant: assign({}, { number: 5, selection: null }), dire: assign({}, { number: 6, selection: null }) }),
  assign({}, { name: 'Pick 1', radiant: assign({}, { number: 7, selection: null }), dire: assign({}, { number: 8, selection: null }) }),
  assign({}, { name: 'Pick 2', radiant: assign({}, { number: 10, selection: null }), dire: assign({}, { number: 9, selection: null }) }),
  assign({}, { name: 'Ban 4', radiant: assign({}, { number: 11, selection: null }), dire: assign({}, { number: 12, selection: null }) }),
  assign({}, { name: 'Ban 5', radiant: assign({}, { number: 13, selection: null }), dire: assign({}, { number: 14, selection: null }) }),
  assign({}, { name: 'Pick 3', radiant: assign({}, { number: 16, selection: null }), dire: assign({}, { number: 15, selection: null }) }),
  assign({}, { name: 'Pick 4', radiant: assign({}, { number: 18, selection: null }), dire: assign({}, { number: 17, selection: null }) }),
  assign({}, { name: 'Ban 6', radiant: assign({}, { number: 20, selection: null }), dire: assign({}, { number: 19, selection: null }) }),
  assign({}, { name: 'Pick 5', radiant: assign({}, { number: 21, selection: null }), dire: assign({}, { number: 22, selection: null }) }),
]];

export default {
  players: [
    newPlayer(1, 'Ken', false),
    newPlayer(2),
    newPlayer(3),
    newPlayer(4),
    newPlayer(5),
    newPlayer(6),
    newPlayer(0, 'Dealer', true),
  ],
  yahtzee: [],
  turn: { player: 0, hand: 0 },
  git: {
    storyID: '',
    branchPrefix: 'features',
    casePreference: 'snake_case',
    commitPrefix: true,
  },
  dota2: [newDota2Lineup()],
  theme: {
    primary: blueGrey,
    secondary: deepOrange,
  },
};
