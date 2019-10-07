import assign from 'lodash/assign';
import map from 'lodash/map';
import indigo from '@material-ui/core/colors/indigo';
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

// used to reset the cards
const NEW_DECK = [
  { name: '2', weight: 2, suit: '♣' },
  { name: '3', weight: 3, suit: '♣' },
  { name: '4', weight: 4, suit: '♣' },
  { name: '5', weight: 5, suit: '♣' },
  { name: '6', weight: 6, suit: '♣' },
  { name: '7', weight: 7, suit: '♣' },
  { name: '8', weight: 8, suit: '♣' },
  { name: '9', weight: 9, suit: '♣' },
  { name: '10', weight: 10, suit: '♣' },
  { name: 'J', weight: 11, suit: '♣' },
  { name: 'Q', weight: 12, suit: '♣' },
  { name: 'K', weight: 13, suit: '♣' },
  { name: 'A', weight: 14, suit: '♣' },
  { name: '2', weight: 2, suit: '♦' },
  { name: '3', weight: 3, suit: '♦' },
  { name: '4', weight: 4, suit: '♦' },
  { name: '5', weight: 5, suit: '♦' },
  { name: '6', weight: 6, suit: '♦' },
  { name: '7', weight: 7, suit: '♦' },
  { name: '8', weight: 8, suit: '♦' },
  { name: '9', weight: 9, suit: '♦' },
  { name: '10', weight: 10, suit: '♦' },
  { name: 'J', weight: 11, suit: '♦' },
  { name: 'Q', weight: 12, suit: '♦' },
  { name: 'K', weight: 13, suit: '♦' },
  { name: 'A', weight: 14, suit: '♦' },
  { name: '2', weight: 2, suit: '♥' },
  { name: '3', weight: 3, suit: '♥' },
  { name: '4', weight: 4, suit: '♥' },
  { name: '5', weight: 5, suit: '♥' },
  { name: '6', weight: 6, suit: '♥' },
  { name: '7', weight: 7, suit: '♥' },
  { name: '8', weight: 8, suit: '♥' },
  { name: '9', weight: 9, suit: '♥' },
  { name: '10', weight: 10, suit: '♥' },
  { name: 'J', weight: 11, suit: '♥' },
  { name: 'Q', weight: 12, suit: '♥' },
  { name: 'K', weight: 13, suit: '♥' },
  { name: 'A', weight: 14, suit: '♥' },
  { name: '2', weight: 2, suit: '♠' },
  { name: '3', weight: 3, suit: '♠' },
  { name: '4', weight: 4, suit: '♠' },
  { name: '5', weight: 5, suit: '♠' },
  { name: '6', weight: 6, suit: '♠' },
  { name: '7', weight: 7, suit: '♠' },
  { name: '8', weight: 8, suit: '♠' },
  { name: '9', weight: 9, suit: '♠' },
  { name: '10', weight: 10, suit: '♠' },
  { name: 'J', weight: 11, suit: '♠' },
  { name: 'Q', weight: 12, suit: '♠' },
  { name: 'K', weight: 13, suit: '♠' },
  { name: 'A', weight: 14, suit: '♠' },
];

// immutably get a copy of new deck O(N)
export const getNewDeck = () => map(NEW_DECK, (val) => assign({}, val));

export default {
  dota2: [newDota2Lineup()],
  git: {
    storyID: '',
    branchMessage: '',
    branchPrefix: 'features',
    casePreference: 'snake_case',
    commitPrefix: true,
  },
  graphql: {
    token: '',
  },
  players: [
    newPlayer(1, 'Ken', false),
    newPlayer(2),
    newPlayer(3),
    newPlayer(4),
    newPlayer(5),
    newPlayer(6),
    newPlayer(0, 'Dealer', true),
  ],
  theme: {
    primary: indigo,
    secondary: deepOrange,
    type: 'dark',
  },
  turn: { player: 0, hand: 0 },
  yahtzee: [],
};
