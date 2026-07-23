import { describe, expect, it } from "vitest";
import { sortCategoriesByFinalEntry } from "./sortCategories";

describe("resume | finances | net-worth | sortCategories", () => {
  it("sorts by descending amounts in the final entry", () => {
    expect(
      sortCategoriesByFinalEntry(
        ["Cash", "Home", "Investments"],
        [
          {
            entryDate: "2020-01",
            amounts: { Cash: 50, Home: 200, Investments: 100 },
          },
          {
            entryDate: "2021-01",
            amounts: { Cash: 10, Home: 30, Investments: 90 },
          },
        ],
      ),
    ).toEqual(["Investments", "Home", "Cash"]);
  });

  it("keeps original order when there are no entries", () => {
    expect(sortCategoriesByFinalEntry(["Cash", "Home"], [])).toEqual([
      "Cash",
      "Home",
    ]);
  });

  it("places zero-value categories at the end", () => {
    expect(
      sortCategoriesByFinalEntry(
        ["New", "Cash", "Investments"],
        [
          {
            entryDate: "2021-01",
            amounts: { Cash: 10, Investments: 90, New: 0 },
          },
        ],
      ),
    ).toEqual(["Investments", "Cash", "New"]);
  });

  it("treats missing amount keys as zero when sorting", () => {
    expect(
      sortCategoriesByFinalEntry(
        ["Cash", "Home", "Investments"],
        [{ entryDate: "2021-01", amounts: { Investments: 90 } }],
      ),
    ).toEqual(["Investments", "Cash", "Home"]);
  });
});
