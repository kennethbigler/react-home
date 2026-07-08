export type StreamEvent =
  | { type: "token"; value: string }
  | { type: "announcement"; value: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Fully pure, fully testable
class AnnouncementEngine {
  constructor(
    private options: {
      debounceMs: number;
      /** Set to false when the content is inherently non-sentential.
       * If outputting a code block, a list, or a table, sentence boundary detection is meaningless and potentially harmful
       * (a . in array.map() would trigger a flush mid-expression). */
      flushOnSentenceBoundary: boolean;
    },
  ) {}

  // Returns a stream/observable of announcement strings
  async *process(
    tokenStream: AsyncIterable<string>,
  ): AsyncIterable<StreamEvent> {
    const { debounceMs, flushOnSentenceBoundary } = this.options;
    const iterator = tokenStream[Symbol.asyncIterator]();
    let buffer = "";
    let lastTokenAt: number | null = null;

    const flush = (): string | null => {
      if (!buffer) return null;
      const text = buffer;
      buffer = "";
      lastTokenAt = null;
      return text;
    };

    while (true) {
      const msUntilDebounce =
        buffer && lastTokenAt
          ? Math.max(0, debounceMs - (Date.now() - lastTokenAt))
          : Infinity;
      // v2 KEY: whatever comes first, debounce timeout or next token
      const outcome = await Promise.race([
        iterator.next().then((result) => ({ kind: "token" as const, result })),
        msUntilDebounce === Infinity
          ? new Promise<never>(() => {})
          : sleep(msUntilDebounce).then(() => ({ kind: "timer" as const })),
      ]);

      if (outcome.kind === "token") {
        if (outcome.result.done) break; // stream finished
        const token = outcome.result.value;
        yield { type: "token", value: token };
        buffer += token;
        lastTokenAt = Date.now();

        // Chunking
        // The idea is to buffer the incoming tokens and only push content to the live region when you have a meaningful unit — typically a sentence or clause boundary.
        // You watch the stream for ., ?, !, or even just a pause in token delivery, and then update the live region.
        // Rough idea — accumulate tokens, flush on sentence boundary
        // The tricky part is that LLMs don't always produce clean sentence boundaries,
        // and you don't want a screen reader user waiting 10 seconds for a long sentence to finish before hearing anything.
        if (flushOnSentenceBoundary && /(?:[.?!]|\.{2,}|\n)\s*$/.test(buffer)) {
          const text = flush();
          if (text) yield { type: "announcement", value: text };
        }
        continue; // back to top of loop
      }

      // Debouncing
      // A complementary approach: instead of waiting for a sentence boundary, you flush the buffer on a timer — say, every 500–800ms — regardless of where you are in the stream.
      // This gives you a "heartbeat" of announcements that feels responsive without flooding.
      // You can combine both strategies: flush on sentence boundary or on timer, whichever comes first.
      // Race resolved because debounceMs passed with no new token
      const text = flush();
      if (text) yield { type: "announcement", value: text };

      // v1 (no debounce)
      // for await (const token of tokenStream) {
      //   yield { type: "token", value: token };
      //   buffer += token;
      //   if (/(?:[.?!]|\.{2,}|\n)\s*$/.test(buffer)) {
      //     yield { type: "announcement", value: buffer };
      //     buffer = "";
      //   }
      // }
    }

    // ensure the last portion of tokens are provided if not on a clean boundary
    if (buffer.length > 0) {
      yield { type: "announcement", value: buffer };
    }
  }
}

export default AnnouncementEngine;
