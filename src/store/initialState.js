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
  theme: {
    primary: blueGrey,
    secondary: deepOrange,
  },
};
