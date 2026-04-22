export const getScoreText = (score?: number, comp?: number) => {
  if (score === undefined || comp === undefined || score === 0) {
    return "";
  } else if (score > 0) {
    return `${score >= 100 && score >= comp ? "🎉 " : ""}${score}`;
  } else {
    return `${score}0 + `;
  }
};
