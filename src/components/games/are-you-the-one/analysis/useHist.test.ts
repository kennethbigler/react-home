import useHist from "./useHist";

// 84,138-160
/** params
 *  len: number,
 *  matches: number[],
 *  noMatch: boolean[][],
 *  roundPairings: {
 *    pairs: number[]; // [lady-i: gent-i]
 *    score: number;
 *  }[]
 */
/** return
 *  hist: {
 *    odds: number;
 *    oddsWeight: number;
 *    rounds: number[];
 *  }[][];
 *  tempScore: number[] = [];
 *  calculatedEquations: {
 *    pairs: number[]; // [lady-i: gent-i]
 *    score: number;
 *  }[]
 */
describe("games | are-you-the-one | analysis | useHist", () => {
  test("useHist", () => {
    expect(
      useHist(
        11,
        [0],
        [
          [false, true, true, true, true, true, true, true, true, true, true],
          [false],
          [false],
          [false],
          [false],
          [false],
          [false],
          [false],
          [false],
          [false],
          [false],
        ],
        [
          { pairs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], score: 1 },
          { pairs: [0, 2, 1, 3, 4, 5, 6, 7, 8, 9, 10], score: 3 },
          { pairs: [0, 2, 1, 3, 9, 8, 7, 6, 5, 4, 10], score: 3 },
        ],
      ),
    ).toEqual({
      hist: [
        [{ odds: 100, oddsWeight: 0, rounds: [0, 1, 2] }],
        [
          undefined,
          { odds: 0, oddsWeight: 1, rounds: [0] },
          { odds: 20, oddsWeight: 2, rounds: [1, 2] },
        ],
        [
          undefined,
          { odds: 20, oddsWeight: 2, rounds: [1, 2] },
          { odds: 0, oddsWeight: 1, rounds: [0] },
        ],
        [
          undefined,
          undefined,
          undefined,
          { odds: 0, oddsWeight: 3, rounds: [0, 1, 2] },
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          { odds: 0, oddsWeight: 2, rounds: [0, 1] },
          undefined,
          undefined,
          undefined,
          undefined,
          { odds: 20, oddsWeight: 1, rounds: [2] },
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          { odds: 0, oddsWeight: 2, rounds: [0, 1] },
          undefined,
          undefined,
          { odds: 20, oddsWeight: 1, rounds: [2] },
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          { odds: 0, oddsWeight: 2, rounds: [0, 1] },
          { odds: 20, oddsWeight: 1, rounds: [2] },
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          { odds: 20, oddsWeight: 1, rounds: [2] },
          { odds: 0, oddsWeight: 2, rounds: [0, 1] },
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          { odds: 20, oddsWeight: 1, rounds: [2] },
          undefined,
          undefined,
          { odds: 0, oddsWeight: 2, rounds: [0, 1] },
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          { odds: 20, oddsWeight: 1, rounds: [2] },
          undefined,
          undefined,
          undefined,
          undefined,
          { odds: 0, oddsWeight: 2, rounds: [0, 1] },
        ],
        [
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          { odds: 0, oddsWeight: 3, rounds: [0, 1, 2] },
        ],
      ],
      tempScore: [1, 1, 1],
      calculatedEquations: [
        {
          pairs: [
            undefined,
            2,
            1,
            3,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            10,
          ],
          score: 2,
        },
        {
          pairs: [
            undefined,
            undefined,
            undefined,
            3,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            10,
          ],
          score: 0,
        },
        {
          pairs: [undefined, undefined, undefined, 3, 4, 5, 6, 7, 8, 9, 10],
          score: 0,
        },
      ],
    });
  });
});
