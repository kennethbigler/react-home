import { zeroOutPreviousWeek, PokerScoreEntry } from '../poker';

describe('constants poker', () => {
  test('zeroOutPreviousWeek', () => {
    const testArray: PokerScoreEntry[] = [{ hello: 1 }, { world: 2 }];
    zeroOutPreviousWeek(testArray);
    expect(testArray).toEqual([
      { hello: 0 },
      { hello: 1, world: 0 },
      { world: 2 },
    ]);
  });
});
