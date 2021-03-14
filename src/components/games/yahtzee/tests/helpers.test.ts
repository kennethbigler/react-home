import getYahtzeeVars from '../helpers';

describe('games | yahtzee | helpers', () => {
  it('gets Yahtzee vars', () => {
    expect(getYahtzeeVars([1], [1])).toEqual({
      topSum: 1, bottomSum: 1, finalTopSum: 1, finish: false,
    });
    expect(getYahtzeeVars([60, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1])).toEqual({
      topSum: 69, bottomSum: 4, finalTopSum: 104, finish: true,
    });
  });
});
