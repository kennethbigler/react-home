import { describe, expect, it } from "vitest";
import sortByEntryDate from "../sortByEntryDate";

describe("apis | sortByEntryDate", () => {
  it("sorts ascending by entryDate", () => {
    expect(
      sortByEntryDate([
        { entryDate: "2022-01", amounts: { Cash: 3 } },
        { entryDate: "2020-01", amounts: { Cash: 1 } },
        { entryDate: "2021-06", amounts: { Cash: 2 } },
      ]).map(({ entryDate }) => entryDate),
    ).toEqual(["2020-01", "2021-06", "2022-01"]);
  });

  it("does not mutate the input array", () => {
    const entries = [{ entryDate: "2022-01" }, { entryDate: "2020-01" }];

    sortByEntryDate(entries);

    expect(entries.map(({ entryDate }) => entryDate)).toEqual([
      "2022-01",
      "2020-01",
    ]);
  });
});
