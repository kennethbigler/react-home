import { describe, it, expect } from "vitest";
import { toTitleCase, getPageTitle, BASE_TITLE } from "./routeTitleUtils";

describe("components | routeTitleUtils", () => {
  describe("toTitleCase", () => {
    it("capitalizes the first letter of each word", () => {
      expect(toTitleCase("hello world")).toBe("Hello World");
    });

    it("lowercases the rest of each word", () => {
      expect(toTitleCase("HELLO WORLD")).toBe("Hello World");
    });

    it("handles single word", () => {
      expect(toTitleCase("cars")).toBe("Cars");
    });

    it("handles hyphenated segments when caller replaces hyphens with spaces", () => {
      expect(toTitleCase("travel map")).toBe("Travel Map");
    });

    it("handles mixed case and numbers", () => {
      expect(toTitleCase("f1")).toBe("F1");
    });

    it("returns empty string for empty input", () => {
      expect(toTitleCase("")).toBe("");
    });
  });

  describe("getPageTitle", () => {
    it("returns base title for empty or root path", () => {
      expect(getPageTitle("")).toBe(BASE_TITLE);
      expect(getPageTitle("/")).toBe(BASE_TITLE);
    });

    it("returns segment title with base for resume sections", () => {
      expect(getPageTitle("/cars")).toBe(`Cars | ${BASE_TITLE}`);
      expect(getPageTitle("/comp")).toBe(`Comp | ${BASE_TITLE}`);
      expect(getPageTitle("/education")).toBe(`Education | ${BASE_TITLE}`);
      expect(getPageTitle("/f1")).toBe(`F1 | ${BASE_TITLE}`);
      expect(getPageTitle("/presentations")).toBe(
        `Presentations | ${BASE_TITLE}`,
      );
      expect(getPageTitle("/resume")).toBe(`Resume | ${BASE_TITLE}`);
      expect(getPageTitle("/work")).toBe(`Work | ${BASE_TITLE}`);
    });

    it("title-cases hyphenated path segments", () => {
      expect(getPageTitle("/travel")).toBe(`Travel | ${BASE_TITLE}`);
    });

    it("returns Games with base when on games index", () => {
      expect(getPageTitle("/games")).toBe(`Games | ${BASE_TITLE}`);
    });

    it("returns game sub-name with base when on a game route", () => {
      expect(getPageTitle("/games/yahtzee")).toBe(
        `Yahtzee | Game | ${BASE_TITLE}`,
      );
      expect(getPageTitle("/games/are-you-the-one")).toBe(
        `Are You The One | Game | ${BASE_TITLE}`,
      );
    });

    it("strips hash from pathname when present", () => {
      expect(getPageTitle("#/work")).toBe(`Work | ${BASE_TITLE}`);
    });
  });
});
