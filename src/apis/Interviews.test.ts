import {
  doTasks, isAmbigram1, isAmbigram2, intersect, maxProfit, intToRoman, romanToInt,
} from './Interviews';

describe('apis | Interviews', () => {
  test('Facebook | doTasks', () => {
    expect(doTasks([1, 1, 2, 0, 2, 1], 4)).toStrictEqual(11);
    expect(doTasks([1, 1, 2, 0, 2, 1], 4)).toStrictEqual(11);
    expect(doTasks([1, 1, 3, 2, 1, 2, 1], 3)).toStrictEqual(13);
  });

  test('Google | isAmbigram', () => {
    expect(isAmbigram1([1, 8, 1])).toStrictEqual(true);
    expect(isAmbigram1([1, 8, 8, 1])).toStrictEqual(true);
    expect(isAmbigram1([1, 6, 9, 1])).toStrictEqual(true);
    expect(isAmbigram1([1, 6, 1])).toStrictEqual(false);
  });

  test('Code Golf | isAmbigram', () => {
    expect(isAmbigram2('181')).toStrictEqual(true);
    expect(isAmbigram2('1691')).toStrictEqual(true);
    expect(isAmbigram2('161')).toStrictEqual(false);
  });

  test('GigNow | Intersect', () => {
    expect(intersect([1, 2, 3, 3, 4, 5, 6], [3, 3, 5])).toStrictEqual([3, 3, 5]);
    expect(intersect([1, 2, 3, 3, 4, 5, 6], [3, 5, 7])).toStrictEqual([3, 5]);
    expect(intersect([3, 5, 7], [1, 2, 3, 3, 4, 5, 6])).toStrictEqual([3, 5]);
    expect(intersect([1, 2, 3, 3, 4, 5, 6], [7, 8, 9])).toStrictEqual([]);
  });

  test('GigNow | Max Profit', () => {
    expect(maxProfit([])).toStrictEqual(0);
    expect(maxProfit([7, 1, 5, 3, 6, 4])).toStrictEqual(5);
    expect(maxProfit([7, 6, 4, 3, 1])).toStrictEqual(0);
    expect(maxProfit([7, 2, 8, 1, 5, 3, 6, 4])).toStrictEqual(6);
  });

  test('GigNow | Int to Roman', () => {
    expect(intToRoman(-3)).toStrictEqual('III');
    expect(intToRoman(0)).toStrictEqual('');
    expect(intToRoman(3)).toStrictEqual('III');
    expect(intToRoman(4)).toStrictEqual('IV');
    expect(intToRoman(9)).toStrictEqual('IX');
    expect(intToRoman(58)).toStrictEqual('LVIII');
    expect(intToRoman(1994)).toStrictEqual('MCMXCIV');
  });

  test('GigNow | Roman to Int', () => {
    expect(romanToInt('')).toStrictEqual(0);
    expect(romanToInt('III')).toStrictEqual(3);
    expect(romanToInt('IV')).toStrictEqual(4);
    expect(romanToInt('IX')).toStrictEqual(9);
    expect(romanToInt('LVIII')).toStrictEqual(58);
    expect(romanToInt('MCMXCIV')).toStrictEqual(1994);
  });
});
