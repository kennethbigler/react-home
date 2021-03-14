import {
  rankHand, getHistogram, evaluate, getCardsToDiscard,
} from '../helpers';

const hand = [
  { name: 'K', weight: 13, suit: '♠' },
  { name: 'Q', weight: 12, suit: '♠' },
  { name: 'J', weight: 11, suit: '♠' },
  { name: '10', weight: 10, suit: '♠' },
  { name: '9', weight: 9, suit: '♥' },
];

describe('games | poker | helpers', () => {
  test('rankHand', () => {
    expect(rankHand(hand, [4])).toEqual(7);
    expect(rankHand(hand, [3, 2])).toEqual(6);
    expect(rankHand(hand, [3, 1])).toEqual(3);
    expect(rankHand(hand, [2, 2, 1])).toEqual(2);
    expect(rankHand(hand, [2, 1, 1])).toEqual(1);
    expect(rankHand(hand, [1, 1, 1, 1, 1])).toEqual(4);
    expect(rankHand(hand, [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1])).toEqual(4);
    expect(rankHand(hand.slice(0, 3), [1, 1, 1, 1, 1])).toEqual(8);
    expect(rankHand(hand.slice(0, 3), [0])).toEqual(5);
    expect(rankHand(hand, [0])).toEqual(0);
  });

  test('getHistogram', () => {
    expect(getHistogram([{ name: 'K', weight: 13, suit: '♠' }])).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]);
  });

  test('evaluate', () => {
    expect(evaluate(hand)).toEqual('4789ab');
  });

  test('getCardsToDiscard', () => {
    /* draw 4-5 on high card */
    expect(getCardsToDiscard(4, [0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0], [...hand.slice(0, 4), { name: '8', weight: 8, suit: '♥' }])).toEqual([1, 2, 3, 4]);
    /* draw 3 on 2 of a kind */
    expect(getCardsToDiscard(3, [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 0], [{ name: 'K', weight: 13, suit: '♥' }, ...hand.slice(0, 4)])).toEqual([2, 3, 4]);
    /* draw 1 on 3 of a kind */
    expect(getCardsToDiscard(1, [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 0], [{ name: 'K', weight: 13, suit: '♦' }, { name: 'K', weight: 13, suit: '♥' }, ...hand.slice(0, 3)])).toEqual([4]);
    /* draw 1 on 2 Pair */
    expect(getCardsToDiscard(1, [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0], [{ name: 'K', weight: 13, suit: '♥' }, { name: 'Q', weight: 12, suit: '♥' }, ...hand.slice(0, 3)])).toEqual([4]);
  });
});
