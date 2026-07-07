import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AnnouncementEngine, { type StreamEvent } from "./AnnouncementEngine";

async function collect<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const results: T[] = [];
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

async function* pausingStream(
  first: string,
  pauseMs: number,
  second: string,
): AsyncIterable<string> {
  yield first;
  await new Promise((resolve) => setTimeout(resolve, pauseMs));
  yield second;
}

const announcementsFrom = (events: StreamEvent[]) =>
  events
    .filter((event) => event.type === "announcement")
    .map((event) => event.value);

const tokensFrom = (events: StreamEvent[]) =>
  events.filter((event) => event.type === "token").map((event) => event.value);

describe("resume | a11y-practice | AnnouncementEngine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("yields a token event for every incoming token", async () => {
    const engine = new AnnouncementEngine({
      debounceMs: 500,
      flushOnSentenceBoundary: true,
    });

    const eventsPromise = collect(
      engine.process(streamFromTokens(["Hello ", "world."])),
    );
    await vi.runAllTimersAsync();
    const events = await eventsPromise;

    expect(tokensFrom(events)).toEqual(["Hello ", "world."]);
  });

  it("flushes on sentence boundary", async () => {
    const engine = new AnnouncementEngine({
      debounceMs: 500,
      flushOnSentenceBoundary: true,
    });

    const eventsPromise = collect(
      engine.process(
        streamFromTokens(["Hello ", "world. ", "How ", "are ", "you?"]),
      ),
    );
    await vi.runAllTimersAsync();
    const events = await eventsPromise;

    expect(announcementsFrom(events)).toEqual([
      "Hello world. ",
      "How are you?",
    ]);
  });

  it("flushes on newline boundary", async () => {
    const engine = new AnnouncementEngine({
      debounceMs: 500,
      flushOnSentenceBoundary: true,
    });

    const eventsPromise = collect(
      engine.process(streamFromTokens(["Episode I\n", "THE PHANTOM MENACE\n"])),
    );
    await vi.runAllTimersAsync();
    const events = await eventsPromise;

    expect(announcementsFrom(events)).toEqual([
      "Episode I\n",
      "THE PHANTOM MENACE\n",
    ]);
  });

  it("flushes on debounce when no boundary arrives", async () => {
    const engine = new AnnouncementEngine({
      debounceMs: 500,
      flushOnSentenceBoundary: true,
    });

    const announcements: string[] = [];

    void (async () => {
      for await (const event of engine.process(
        pausingStream("mid sentence", 10_000, " continues"),
      )) {
        if (event.type === "announcement") announcements.push(event.value);
      }
    })();

    await vi.advanceTimersByTimeAsync(500);

    expect(announcements).toEqual(["mid sentence"]);
  });

  it("flushes trailing buffer at end of stream", async () => {
    const engine = new AnnouncementEngine({
      debounceMs: 500,
      flushOnSentenceBoundary: true,
    });

    const eventsPromise = collect(
      engine.process(streamFromTokens(["no boundary here"])),
    );
    await vi.runAllTimersAsync();
    const events = await eventsPromise;

    expect(announcementsFrom(events)).toEqual(["no boundary here"]);
  });

  it("does not flush on sentence boundary when flushOnSentenceBoundary is false", async () => {
    const engine = new AnnouncementEngine({
      debounceMs: 50,
      flushOnSentenceBoundary: false,
    });

    const eventsPromise = collect(
      engine.process(streamFromTokens(["Hello ", "world."])),
    );
    await vi.advanceTimersByTimeAsync(50);
    await vi.runAllTimersAsync();
    const events = await eventsPromise;

    expect(announcementsFrom(events)).toEqual(["Hello world."]);
  });

  it("does not re-announce already-announced content in later chunks", async () => {
    const engine = new AnnouncementEngine({
      debounceMs: 500,
      flushOnSentenceBoundary: true,
    });

    const eventsPromise = collect(
      engine.process(streamFromTokens(["Hello ", "world. ", "More ", "text."])),
    );
    await vi.runAllTimersAsync();
    const events = await eventsPromise;
    const announcements = announcementsFrom(events);

    expect(announcements).toHaveLength(2);
    expect(announcements[0]).toBe("Hello world. ");
    expect(announcements[1]).toBe("More text.");
    expect(announcements[1]).not.toContain("Hello world.");
  });
});
