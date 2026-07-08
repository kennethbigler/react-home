// Simulates an LLM token stream for practicing announcement/chunking logic.
// Splits text into word-ish chunks (sometimes mid-word) and yields them
// with randomized delays, so both "clean sentence" and "stalled stream"
// cases show up naturally.

type MockTokenStreamOptions = {
  minDelayMs?: number;
  maxDelayMs?: number;
  // Occasionally split a word into two tokens to mimic sub-word BPE tokens.
  midWordSplitChance?: number;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Breaks raw text into token-like pieces: words (with trailing whitespace/
// punctuation attached) that are sometimes further split mid-word.
const tokenize = (text: string, midWordSplitChance: number): string[] => {
  const words = text.match(/\S+\s*/g) ?? [];

  return words.flatMap((word) => {
    if (word.trim().length <= 2 || Math.random() > midWordSplitChance) {
      return [word];
    }

    const splitAt = randomBetween(1, word.trim().length - 1);
    return [word.slice(0, splitAt), word.slice(splitAt)];
  });
};

// Async generator satisfying AsyncIterable<string> — feed directly into
// AnnouncementEngine.process().
async function* mockTokenStream(
  text: string,
  options: MockTokenStreamOptions = {},
): AsyncIterable<string> {
  const {
    minDelayMs = 30,
    maxDelayMs = 150,
    midWordSplitChance = 0.15,
  } = options;

  const tokens = tokenize(text, midWordSplitChance);

  for (const token of tokens) {
    await wait(randomBetween(minDelayMs, maxDelayMs));
    yield token;
  }
}

export default mockTokenStream;
