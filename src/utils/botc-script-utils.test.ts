import { describe, it, expect } from "vitest";
import {
  buildScriptFromCharacters,
  getAllCommunityScripts,
  getAllScriptOptions,
  BUILTIN_SCRIPT_OPTIONS,
  getBuiltinScriptLabel,
} from "./botc-script-utils";

describe("botc-script-utils", () => {
  describe("BUILTIN_SCRIPT_OPTIONS", () => {
    it("has 4 entries", () => {
      expect(BUILTIN_SCRIPT_OPTIONS).toHaveLength(4);
    });

    it("includes Trouble Brewing at index 0", () => {
      const tb = BUILTIN_SCRIPT_OPTIONS.find((o) => o.scriptIndex === 0);
      expect(tb?.label).toBe("Trouble Brewing");
    });

    it("all have type 'builtin'", () => {
      BUILTIN_SCRIPT_OPTIONS.forEach((o) => {
        expect(o.type).toBe("builtin");
      });
    });
  });

  describe("getAllCommunityScripts", () => {
    it("returns a non-empty array", () => {
      const scripts = getAllCommunityScripts();
      expect(scripts.length).toBeGreaterThan(0);
    });

    it("each script has required fields", () => {
      const scripts = getAllCommunityScripts();
      scripts.forEach((s) => {
        expect(typeof s.pk).toBe("number");
        expect(typeof s.title).toBe("string");
        expect(typeof s.author).toBe("string");
        expect(Array.isArray(s.characters)).toBe(true);
      });
    });
  });

  describe("getAllScriptOptions", () => {
    it("starts with the 4 builtin options", () => {
      const options = getAllScriptOptions();
      const builtins = options.filter((o) => o.type === "builtin");
      expect(builtins).toHaveLength(4);
    });

    it("includes community script options", () => {
      const options = getAllScriptOptions();
      const community = options.filter((o) => o.type === "community");
      expect(community.length).toBeGreaterThan(0);
    });

    it("community options have scriptIndex of 5", () => {
      const options = getAllScriptOptions();
      options
        .filter((o) => o.type === "community")
        .forEach((o) => {
          expect(o.scriptIndex).toBe(5);
        });
    });

    it("community options have pk, author, and characters", () => {
      const options = getAllScriptOptions();
      const communityOptions = options.filter((o) => o.type === "community");
      communityOptions.forEach((o) => {
        if (o.type === "community") {
          expect(typeof o.pk).toBe("number");
          expect(typeof o.author).toBe("string");
          expect(Array.isArray(o.characters)).toBe(true);
        }
      });
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

  describe("getBuiltinScriptLabel", () => {
    it("returns correct label for index 0", () => {
      expect(getBuiltinScriptLabel(0)).toBe("Trouble Brewing");
    });

    it("returns correct label for index 3", () => {
      expect(getBuiltinScriptLabel(3)).toBe("Other (All Roles)");
    });

    it("returns 'Unknown Script' for unrecognised index", () => {
      expect(getBuiltinScriptLabel(99)).toBe("Unknown Script");
    });
  });
});
