interface YahtzeeVars {
  topSum: number;
  bottomSum: number;
  finalTopSum: number;
  finish: boolean;
}

const getYahtzeeVars = (topScores: number[], bottomScores: number[]): YahtzeeVars => {
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
};

export default getYahtzeeVars;
