import { describe, expect, it } from "vitest";
import {
  type RouteMenuItem,
  interleaveDividers,
  isNavMenuItem,
} from "./menu-types";

const mockComponent = {} as RouteMenuItem["Component"];

const routeItem = (name: string, route: string): RouteMenuItem => ({
  name,
  route,
  Component: mockComponent,
});

describe("common | menu-types", () => {
  describe("isNavMenuItem", () => {
    it("returns false for dividers", () => {
      expect(isNavMenuItem({ divider: true })).toBe(false);
    });

    it("returns true for route menu items", () => {
      expect(isNavMenuItem(routeItem("Summary", ""))).toBe(true);
    });

    it("returns true for cross-section links", () => {
      expect(isNavMenuItem({ link: true, name: "Games", route: "games" })).toBe(
        true,
      );
    });
  });

  describe("interleaveDividers", () => {
    it("returns an empty array when all groups are empty", () => {
      expect(interleaveDividers([[], []])).toEqual([]);
    });

    it("returns a single group without a leading divider", () => {
      const homeGroup = [routeItem("Home", "")];

      expect(interleaveDividers([homeGroup])).toEqual(homeGroup);
    });

    it("inserts dividers between non-empty groups", () => {
      const firstGroup = [routeItem("Home", "")];
      const secondGroup = [routeItem("Bridge", "bridge")];

      expect(interleaveDividers([firstGroup, secondGroup])).toEqual([
        firstGroup[0],
        { divider: true },
        secondGroup[0],
      ]);
    });

    it("skips empty groups so dividers are not inserted for gaps", () => {
      const firstGroup = [routeItem("Home", "")];
      const thirdGroup = [routeItem("Bridge", "bridge")];

      expect(interleaveDividers([firstGroup, [], thirdGroup])).toEqual([
        firstGroup[0],
        { divider: true },
        thirdGroup[0],
      ]);
    });
  });
});
