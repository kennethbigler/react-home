import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import mockTokenStream from "./mockTokenStream";

async function collectTokens(
  text: string,
  options?: Parameters<typeof mockTokenStream>[1],
): Promise<string[]> {
  const tokens: string[] = [];
  for await (const token of mockTokenStream(text, options)) {
    tokens.push(token);
  }
  return tokens;
}

describe("resume | a11y-practice | mockTokenStream", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("yields tokenized words with default delays", async () => {
    vi.spyOn(Math, "random").mockReturnValue(1); // never mid-word split

    const promise = collectTokens("Hello world");
    await vi.runAllTimersAsync();
    const tokens = await promise;

    expect(tokens).toEqual(["Hello ", "world"]);
  });

  it("uses custom delay and split options", async () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0) // mid-word split attempt
      .mockReturnValueOnce(0.5); // split at index 2 for "Hello " (trim len 5)

    const promise = collectTokens("Hello world", {
      minDelayMs: 10,
      maxDelayMs: 20,
      midWordSplitChance: 1,
    });
    await vi.runAllTimersAsync();
    const tokens = await promise;

    expect(tokens.length).toBeGreaterThan(2);
    expect(tokens.join("")).toBe("Hello world");
  });

  it("does not split short words even when split chance is high", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const promise = collectTokens("I am ok", {
      midWordSplitChance: 1,
    });
    await vi.runAllTimersAsync();
    const tokens = await promise;

    expect(tokens).toEqual(["I ", "am ", "ok"]);
  });

  it("splits a long word when random is below midWordSplitChance", async () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0) // passes split gate
      .mockReturnValueOnce(0); // randomBetween(1, len-1) → index 1

    const promise = collectTokens("Hello", {
      minDelayMs: 0,
      maxDelayMs: 0,
      midWordSplitChance: 1,
    });
    await vi.runAllTimersAsync();
    const tokens = await promise;

    expect(tokens).toEqual(["H", "ello"]);
  });

  it("returns no tokens for empty text", async () => {
    vi.spyOn(Math, "random").mockReturnValue(1);

    const promise = collectTokens("");
    await vi.runAllTimersAsync();
    const tokens = await promise;

    expect(tokens).toEqual([]);
  });

  it("returns no tokens for whitespace-only text", async () => {
    vi.spyOn(Math, "random").mockReturnValue(1);

    const promise = collectTokens("   \n\t");
    await vi.runAllTimersAsync();
    const tokens = await promise;

    expect(tokens).toEqual([]);
  });

  it("preserves trailing whitespace and punctuation on tokens", async () => {
    vi.spyOn(Math, "random").mockReturnValue(1);

    const promise = collectTokens("Wait... really?");
    await vi.runAllTimersAsync();
    const tokens = await promise;

    expect(tokens.join("")).toBe("Wait... really?");
  });
});
