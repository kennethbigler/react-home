import { describe, it, expect } from "vitest";
import {
  buildScriptFromCharacters,
  loadAllScriptOptions,
  BASE_SCRIPT_OPTIONS,
  getBaseScriptLabel,
} from "./botc-script-utils";

describe("botc-script-utils", () => {
  describe("BASE_SCRIPT_OPTIONS", () => {
    it("has 4 entries", () => {
      expect(BASE_SCRIPT_OPTIONS).toHaveLength(4);
    });

    it("includes Trouble Brewing at index 0", () => {
      const tb = BASE_SCRIPT_OPTIONS.find((o) => o.index === 0);
      expect(tb?.label).toBe("Trouble Brewing");
    });

    it("all have type 'base'", () => {
      BASE_SCRIPT_OPTIONS.forEach((o) => {
        expect(o.type).toBe("base");
      });
    });
  });

  describe("loadAllScriptOptions (async)", () => {
    it("starts with the 4 base options", async () => {
      const options = await loadAllScriptOptions();
      const bases = options.filter((o) => o.type === "base");
      expect(bases).toHaveLength(4);
    });

    it("includes community script options", async () => {
      const options = await loadAllScriptOptions();
      const community = options.filter((o) => o.type === "community");
      expect(community.length).toBeGreaterThan(0);
    });

    it("community options have pk, author, and characters", async () => {
      const options = await loadAllScriptOptions();
      const communityOptions = options.filter((o) => o.type === "community");
      communityOptions.forEach((o) => {
        if (o.type === "community") {
          expect(typeof o.pk).toBe("number");
          expect(typeof o.author).toBe("string");
          expect(Array.isArray(o.characters)).toBe(true);
        }
      });
    });

    it("returns the same cached array on subsequent calls", async () => {
      const first = await loadAllScriptOptions();
      const second = await loadAllScriptOptions();
      expect(first).toBe(second); // reference equality — same object
    });
  });

  describe("buildScriptFromCharacters", () => {
    it("returns a BotCScript with all category arrays", () => {
      const script = buildScriptFromCharacters([]);
      expect(script).toHaveProperty("townsfolk");
      expect(script).toHaveProperty("outsiders");
      expect(script).toHaveProperty("minions");
      expect(script).toHaveProperty("demons");
      expect(script).toHaveProperty("travelers");
    });

    it("categorises known official roles correctly", () => {
      const script = buildScriptFromCharacters([
        "washerwoman", // townsfolk
        "drunk", // outsider
        "poisoner", // minion
        "imp", // demon
        "thief", // traveler
      ]);
      expect(script.townsfolk).toHaveLength(1);
      expect(script.outsiders).toHaveLength(1);
      expect(script.minions).toHaveLength(1);
      expect(script.demons).toHaveLength(1);
      expect(script.travelers).toHaveLength(1);
    });

    it("handles underscore slugs (fortune_teller)", () => {
      const script = buildScriptFromCharacters(["fortune_teller"]);
      const role = script.townsfolk.find((r) => r.name === "Fortune Teller");
      expect(role).toBeDefined();
    });

    it("handles hyphen slugs (pit-hag)", () => {
      const script = buildScriptFromCharacters(["pit-hag"]);
      const role = script.minions.find((r) => r.name === "Pit-Hag");
      expect(role).toBeDefined();
    });

    it("puts unknown/homebrew roles in townsfolk as placeholders", () => {
      const script = buildScriptFromCharacters(["cook", "alice_duchess"]);
      // Both are unknown — they should be in townsfolk with placeholder names
      expect(script.townsfolk.some((r) => r.name.includes("Unknown"))).toBe(
        true,
      );
    });

    it("deduplicates roles — same slug appearing twice only appears once", () => {
      const script = buildScriptFromCharacters(["imp", "imp"]);
      expect(script.demons).toHaveLength(1);
    });

    it("deduplicates across slug variants (scarlet_woman vs scarletwoman)", () => {
      const script = buildScriptFromCharacters([
        "scarlet_woman",
        "scarletwoman",
      ]);
      expect(script.minions).toHaveLength(1);
    });

    it("builds a typical community script correctly", () => {
      const characters = [
        "chef",
        "empath",
        "investigator",
        "monk",
        "ravenkeeper",
        "mayor",
        "fortune_teller",
        "washerwoman",
        "drunk",
        "recluse",
        "poisoner",
        "spy",
        "imp",
      ];
      const script = buildScriptFromCharacters(characters);
      expect(script.townsfolk.length).toBeGreaterThan(0);
      expect(script.outsiders.length).toBeGreaterThan(0);
      expect(script.minions.length).toBeGreaterThan(0);
      expect(script.demons.length).toBeGreaterThan(0);
    });
  });

  describe("getBaseScriptLabel", () => {
    it("returns correct label for index 0", () => {
      expect(getBaseScriptLabel(0)).toBe("Trouble Brewing");
    });

    it("returns correct label for index 3", () => {
      expect(getBaseScriptLabel(3)).toBe("Other (All Roles)");
    });

    it("returns 'Unknown Script' for an out-of-range index", () => {
      // Cast to bypass type safety — tests the ?? fallback branch
      expect(
        getBaseScriptLabel(99 as Parameters<typeof getBaseScriptLabel>[0]),
      ).toBe("Unknown Script");
    });
  });
});
