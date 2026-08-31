/** Return a new array with the items in uniformly random order (Fisher–Yates). */
const shuffleArray = <T>(items: readonly T[]): T[] => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default shuffleArray;
