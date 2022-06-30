import { selector } from "recoil";
import yahtzeeAtom from "./yahtzee-atom";

const sumsYahtzeeSelector = selector({
  key: "sumsYahtzeeSelector",
  get: ({ get }) => {
    const { topScores, bottomScores } = get(yahtzeeAtom);

    let count = 0;

    const topSum = topScores.reduce((sum, score) => {
      if (score >= 0) {
        count += 1;
        sum += score;
      }
      return sum;
    }, 0);

    const bottomSum = bottomScores.reduce((sum, score) => {
      if (score >= 0) {
        count += 1;
        sum += score;
      }
      return sum;
    }, 0);

    let finalTopSum = topSum;
    if (topSum >= 63) {
      finalTopSum += 35;
    }

    const finish = count >= 13;

    return {
      topSum,
      bottomSum,
      finalTopSum,
      finish,
    };
  },
});

export default sumsYahtzeeSelector;
