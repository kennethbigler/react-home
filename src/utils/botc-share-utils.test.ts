import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildShareUrl, parseShareParams } from "./botc-share-utils";
import { BotCPlayer, BaseScript } from "../jotai/botc-atom";
import { resetScriptOptionsCache } from "./botc-script-utils";

const makePlayers = (names: string[]): BotCPlayer[] =>
  names.map((name) => ({
    name,
    roles: [],
    notes: "",
    liar: false,
    used: false,
    exec: false,
    kill: false,
  }));

vi.mock("../data/botc-scripts.json", () => ({
  default: {
    slugs: ["chef", "monk"],
    scripts: [{ p: 42, t: "Test Script", a: "Author", c: [0, 1] }],
  },
}));

beforeEach(() => {
  resetScriptOptionsCache();
});

describe("buildShareUrl", () => {
  it("encodes a base script with players and names", () => {
    const url = buildShareUrl(
      { type: "base", index: BaseScript.TB },
      3,
      0,
      makePlayers(["Alice", "Bob", "Carol", "unused"]),
    );

    expect(url).toMatch(/^https:\/\/www\.kennethbigler\.com\/games\/botc\?/);
    expect(url).toContain("script=base%3A0");
    expect(url).toContain("players=3");
    expect(url).toContain("names=Alice_Bob_Carol");
    expect(url).not.toContain("unused");
  });

  it("encodes a community script by pk", () => {
    const url = buildShareUrl(
      {
        type: "community",
        pk: 42,
        title: "Test Script",
        author: "Author",
        characters: ["chef"],
      },
      2,
      1,
      makePlayers(["Alice", "Bob", "Traveler"]),
    );

    expect(url).toContain("script=community%3A42");
    expect(url).toContain("players=2");
    expect(url).toContain("names=Alice_Bob_Traveler");
  });

  it("uses _ as delimiter (no percent-encoding for _)", () => {
    const url = buildShareUrl(
      { type: "base", index: BaseScript.TB },
      2,
      0,
      makePlayers(["Alice", "Bob"]),
    );
    const namesParam = new URLSearchParams(url.split("?")[1]).get("names");
    expect(namesParam).toBe("Alice_Bob");
  });

  it("derives traveler count from names.length - players", () => {
    const url = buildShareUrl(
      { type: "base", index: BaseScript.TB },
      5,
      2,
      makePlayers(["A", "B", "C", "D", "E", "T1", "T2"]),
    );
    const p = new URLSearchParams(url.split("?")[1]);
    const names = p.get("names")!.split("_");
    expect(names).toHaveLength(7);
    expect(names.length - parseInt(p.get("players")!)).toBe(2);
  });
});

describe("parseShareParams", () => {
  it("returns null when params are missing", async () => {
    expect(await parseShareParams("")).toBeNull();
    expect(await parseShareParams("?foo=bar")).toBeNull();
    expect(await parseShareParams("?script=base%3A0&players=5")).toBeNull();
  });

  it("parses a base script share URL", async () => {
    const search = "?script=base%3A0&players=3&names=Alice_Bob_Carol";
    const result = await parseShareParams(search);

    expect(result).not.toBeNull();
    expect(result!.script).toEqual({ type: "base", index: BaseScript.TB });
    expect(result!.numPlayers).toBe(3);
    expect(result!.numTravelers).toBe(0);
    expect(result!.names).toEqual(["Alice", "Bob", "Carol"]);
  });

  it("derives numTravelers from names.length - numPlayers", async () => {
    const search = "?script=base%3A0&players=3&names=Alice_Bob_Carol_T1_T2";
    const result = await parseShareParams(search);

    expect(result!.numPlayers).toBe(3);
    expect(result!.numTravelers).toBe(2);
    expect(result!.names).toHaveLength(5);
  });

  it("parses a community script share URL", async () => {
    const search = "?script=community%3A42&players=2&names=Alice_Bob";
    const result = await parseShareParams(search);

    expect(result).not.toBeNull();
    expect(result!.script).toMatchObject({
      type: "community",
      pk: 42,
      title: "Test Script",
      author: "Author",
    });
  });

  it("returns null for an unknown community script pk", async () => {
    const search = "?script=community%3A999&players=2&names=Alice_Bob";
    expect(await parseShareParams(search)).toBeNull();
  });

  it("returns null for an unrecognised script prefix", async () => {
    const search = "?script=unknown%3A0&players=2&names=Alice_Bob";
    expect(await parseShareParams(search)).toBeNull();
  });

  it("returns null when players is NaN", async () => {
    const search = "?script=base%3A0&players=abc&names=Alice_Bob";
    expect(await parseShareParams(search)).toBeNull();
  });
});
