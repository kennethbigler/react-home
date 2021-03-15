import { newPlayer } from '../../initialState';
import playerReducer, {
  addPlayer, removePlayer, updateName, updateBot, updateBet,
  payout, createSplitHandAction, createDrawCardAction,
  createSwapCardsAction, createNewHandAction, resetStatus,
} from '../players';

const state = [
  newPlayer(1, 'Ken', false),
  newPlayer(2),
];

describe('store | modules | players', () => {
  test('reducer', () => {
    expect(playerReducer(state, addPlayer(state, 'Andrew'))).toHaveLength(3);
    expect(playerReducer(state, removePlayer(2))).toEqual([state[0]]);
    expect(playerReducer(state, updateName(2, 'Andrew'))).toEqual([state[0], { ...state[1], name: 'Andrew' }]);
    expect(playerReducer(state, updateBot(2, false))).toEqual([state[0], { ...state[1], isBot: false }]);
    expect(playerReducer(state, updateBet(2, 69))).toEqual([state[0], { ...state[1], bet: 69 }]);
    expect(playerReducer(state, payout(2, 'status', -31))).toEqual([state[0], { ...state[1], status: 'status', money: 69 }]);
    expect(playerReducer(state, createSplitHandAction(2, [{ cards: [{ name: 'K', weight: 13, suit: '♣' }]}])))
      .toEqual([state[0], { ...state[1], hands: [{ cards: [{ name: 'K', weight: 13, suit: '♣' }]}]}]);
    expect(playerReducer(state, createDrawCardAction(2, [{ cards: [{ name: 'K', weight: 13, suit: '♣' }]}])))
      .toEqual([state[0], { ...state[1], hands: [{ cards: [{ name: 'K', weight: 13, suit: '♣' }]}]}]);
    expect(playerReducer(state, createSwapCardsAction(2, [{ cards: [{ name: 'K', weight: 13, suit: '♣' }]}])))
      .toEqual([state[0], { ...state[1], hands: [{ cards: [{ name: 'K', weight: 13, suit: '♣' }]}]}]);
    expect(playerReducer(state, createNewHandAction(2, [{ name: 'K', weight: 13, suit: '♣' }], true, 10)))
      .toEqual([state[0], { ...state[1], hands: [{ soft: true, weight: 10, cards: [{ name: 'K', weight: 13, suit: '♣' }]}]}]);
    expect(playerReducer([state[0], {
      ...state[1], status: 'any', bet: 10, hands: [{ cards: [{ name: 'K', weight: 13, suit: '♣' }]}],
    }], resetStatus(2)))
      .toEqual([state[0], {
        ...state[1], status: '', bet: 5, hands: [],
      }]);
  });

  test('incorrect parameters', () => {
    // @ts-expect-error: fake action for testing purposes
    expect(playerReducer(state, { type: undefined })).toEqual(state);
    // @ts-expect-error: fake action for testing purposes
    expect(playerReducer(undefined, { type: undefined })).toHaveLength(7);
  });

  test('when there is no valid user for payout, nothing happens', () => {
    expect(playerReducer(state, payout(3, 'status', -31))).toEqual(state);
  });
});
