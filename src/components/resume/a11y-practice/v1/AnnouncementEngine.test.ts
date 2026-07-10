import { describe, expect, it } from "vitest";
import { announceFromTokenStream } from "./AnnouncementEngine";

async function collect(iterable: AsyncIterable<string>): Promise<string[]> {
  const results: string[] = [];
  for await (const item of iterable) results.push(item);
  return results;
}

function streamFromTokens(tokens: string[]): AsyncIterable<string> {
  return {
    async *[Symbol.asyncIterator]() {
      for (const token of tokens) yield token;
    },
  };
}

describe("resume | a11y-practice | v1 announceFromTokenStream", () => {
  it("flushes on sentence boundary", async () => {
    const announcements = await collect(
      announceFromTokenStream(
        streamFromTokens(["Hello ", "world. ", "How ", "are ", "you?"]),
      ),
    );

    expect(announcements).toEqual(["Hello world. ", "How are you?"]);
  });

  it("flushes on newline boundary", async () => {
    const announcements = await collect(
      announceFromTokenStream(
        streamFromTokens(["Episode I\n", "THE PHANTOM MENACE\n"]),
      ),
    );

    expect(announcements).toEqual(["Episode I\n", "THE PHANTOM MENACE\n"]);
  });

  it("flushes trailing buffer when stream ends without a boundary", async () => {
    const announcements = await collect(
      announceFromTokenStream(streamFromTokens(["no boundary here"])),
    );

    expect(announcements).toEqual(["no boundary here"]);
  });

  it("yields nothing for an empty stream", async () => {
    const announcements = await collect(
      announceFromTokenStream(streamFromTokens([])),
    );

    expect(announcements).toEqual([]);
  });
});
