import getYahtzeeVars from '../helpers';
import {
  hasXDice, isFullHouse, isStraight, canYahtzeeBonus,
} from '../score-table/scoreTableHelper';

describe('games | yahtzee | helpers', () => {
  it('gets Yahtzee vars', () => {
    expect(getYahtzeeVars([1], [1])).toEqual({
      topSum: 1, bottomSum: 1, finalTopSum: 1, finish: false,
    });
    expect(getYahtzeeVars([60, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1])).toEqual({
      topSum: 69, bottomSum: 4, finalTopSum: 104, finish: true,
    });
  });

  test('hasXDice', () => {
    expect(hasXDice([1, 1, 2, 2, 2], 3)).toStrictEqual(true);
    expect(hasXDice([1, 1, 2, 2, 3], 3)).toStrictEqual(false);
  });

  test('isFullHouse', () => {
    expect(isFullHouse([1, 1, 2, 2, 2])).toStrictEqual(true);
    expect(isFullHouse([1, 1, 2, 2, 3])).toStrictEqual(false);
  });

  test('isStraight', () => {
    expect(isStraight([1, 2, 3, 4, 5], 5)).toStrictEqual(true);
    expect(isStraight([1, 1, 2, 2, 3], 4)).toStrictEqual(false);
  });

  test('canYahtzeeBonus', () => {
    expect(canYahtzeeBonus([1, 1, 1, 1, 1], [{ name: 'Ken', score: 5 }])).toStrictEqual(true);
    expect(canYahtzeeBonus([1, 1, 2, 2, 3], [{ name: 'Ken', score: 5 }])).toStrictEqual(false);
  });
});
