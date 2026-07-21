import { describe, expect, it } from "vitest";
import a11yTabProps from "./a11y-tab-props";

describe("common | tab-group | a11yTabProps", () => {
  it("returns id and aria-controls for the given prefix and index", () => {
    expect(a11yTabProps("example-tabs", 0)).toEqual({
      id: "example-tabs-0",
      "aria-controls": "example-tabspanel-0",
    });
    expect(a11yTabProps("finance-tab", 2)).toEqual({
      id: "finance-tab-2",
      "aria-controls": "finance-tabpanel-2",
    });
  });
});
