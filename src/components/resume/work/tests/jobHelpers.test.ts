import { describe, expect, it } from "vitest";
import { groupExpr, parseExprGroup } from "../jobHelpers";

describe("resume | work | jobHelpers", () => {
  describe("groupExpr", () => {
    it("splits groups on empty strings", () => {
      expect(groupExpr(["a", "b", "", "c"])).toEqual([["a", "b"], ["c"]]);
    });

    it("ignores leading and trailing empty strings", () => {
      expect(groupExpr(["", "a", ""])).toEqual([["a"]]);
    });
  });

  describe("parseExprGroup", () => {
    it("nests lines prefixed with * under the previous item", () => {
      expect(
        parseExprGroup(["Section header", "* First detail", "* Second detail"]),
      ).toEqual([
        {
          text: "Section header",
          children: ["First detail", "Second detail"],
        },
      ]);
    });

    it("leaves unprefixed lines as top-level items", () => {
      expect(parseExprGroup(["One", "Two", "Three"])).toEqual([
        { text: "One", children: [] },
        { text: "Two", children: [] },
        { text: "Three", children: [] },
      ]);
    });
  });
});
