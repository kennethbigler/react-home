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

    it("collapses consecutive empty strings into a single split", () => {
      expect(groupExpr(["a", "", "", "b"])).toEqual([["a"], ["b"]]);
    });

    it("returns an empty array for empty input", () => {
      expect(groupExpr([])).toEqual([]);
    });

    it("returns a single group when no separators are present", () => {
      expect(groupExpr(["a", "b", "c"])).toEqual([["a", "b", "c"]]);
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

    it("starts a new parent when a new unprefixed line follows sub-bullets", () => {
      expect(
        parseExprGroup([
          "First role",
          "* Detail one",
          "Second role",
          "* Detail two",
        ]),
      ).toEqual([
        { text: "First role", children: ["Detail one"] },
        { text: "Second role", children: ["Detail two"] },
      ]);
    });

    it("treats leading sub-bullets as top-level items when no parent exists", () => {
      expect(parseExprGroup(["* Orphan detail"])).toEqual([
        { text: "Orphan detail", children: [] },
      ]);
    });

    it("strips the * prefix from nested text", () => {
      const [{ children }] = parseExprGroup(["Header", "* Prefixed detail"]);
      expect(children).toEqual(["Prefixed detail"]);
      expect(children[0]).not.toMatch(/^\* /);
    });
  });
});
