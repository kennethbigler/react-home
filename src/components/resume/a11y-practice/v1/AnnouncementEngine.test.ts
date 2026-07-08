import { describe, expect, it } from "vitest";
import AnnouncementEngine from "./AnnouncementEngine";

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

describe("resume | a11y-practice | v1 AnnouncementEngine", () => {
  it("flushes on sentence boundary", async () => {
    const engine = new AnnouncementEngine();
    const announcements = await collect(
      engine.process(
        streamFromTokens(["Hello ", "world. ", "How ", "are ", "you?"]),
      ),
    );

    expect(announcements).toEqual(["Hello world. ", "How are you?"]);
  });

  it("flushes on newline boundary", async () => {
    const engine = new AnnouncementEngine();
    const announcements = await collect(
      engine.process(streamFromTokens(["Episode I\n", "THE PHANTOM MENACE\n"])),
    );

    expect(announcements).toEqual(["Episode I\n", "THE PHANTOM MENACE\n"]);
  });

  it("flushes trailing buffer when stream ends without a boundary", async () => {
    const engine = new AnnouncementEngine();
    const announcements = await collect(
      engine.process(streamFromTokens(["no boundary here"])),
    );

    expect(announcements).toEqual(["no boundary here"]);
  });

  it("yields nothing for an empty stream", async () => {
    const engine = new AnnouncementEngine();
    const announcements = await collect(engine.process(streamFromTokens([])));

    expect(announcements).toEqual([]);
  });
});
