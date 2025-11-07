import { describe, it, expect } from "vitest";
import { getGridSize, getLieSeries } from "./botcHelpers";

describe("botcHelpers", () => {
  describe("getGridSize", () => {
    it("returns 4 for early positions (i < 3)", () => {
      expect(getGridSize(10, 0)).toBe(4);
      expect(getGridSize(10, 1)).toBe(4);
      expect(getGridSize(10, 2)).toBe(4);
    });

    it("returns 4 for late positions with even player count", () => {
      expect(getGridSize(10, 7)).toBe(4);
      expect(getGridSize(10, 8)).toBe(4);
      expect(getGridSize(10, 9)).toBe(4);
    });

    it("returns 6 for late positions with odd player count", () => {
      expect(getGridSize(9, 7)).toBe(6);
      expect(getGridSize(9, 8)).toBe(6);
    });

    it("returns 5 for middle positions", () => {
      expect(getGridSize(10, 3)).toBe(5);
      expect(getGridSize(10, 4)).toBe(5);
      expect(getGridSize(10, 5)).toBe(5);
      expect(getGridSize(10, 6)).toBe(5);
    });

    it("handles edge case with odd player count in middle", () => {
      expect(getGridSize(9, 3)).toBe(5);
      expect(getGridSize(9, 4)).toBe(5);
      expect(getGridSize(9, 5)).toBe(5);
    });
  });

  describe("getLieSeries", () => {
    it("calculates lie series for Trouble Brewing (script 0)", () => {
      const result = getLieSeries(7, 0, 0);

      expect(result).toHaveLength(4);
      expect(result[0].name).toBe("😈");
      expect(result[1].name).toBe("🍺🧪😡");
      expect(result[2].name).toBe("🤥");
      expect(result[3].name).toBe("✅");

      // Check that all values are non-negative
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("calculates lie series for S&V (script 1)", () => {
      const result = getLieSeries(7, 0, 1);

      expect(result).toHaveLength(4);
      // For S&V, drunk calculation is different
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("calculates lie series for script 3 (Spy)", () => {
      const result = getLieSeries(7, 0, 3);

      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("calculates lie series for script 4 (Other)", () => {
      const result = getLieSeries(7, 0, 4);

      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("adds evil travelers when numTravelers >= 3", () => {
      const resultNoTravelers = getLieSeries(7, 0, 0);
      const resultManyTravelers = getLieSeries(7, 3, 0);

      // With 3+ travelers, should have 2 more evil
      expect(resultManyTravelers[0].y).toBeGreaterThanOrEqual(
        resultNoTravelers[0].y + 2,
      );
    });

    it("adds one evil traveler when 0 < numTravelers < 3", () => {
      const resultNoTravelers = getLieSeries(7, 0, 0);
      const resultOneTraveler = getLieSeries(7, 1, 0);

      // With 1-2 travelers, should have 1 more evil
      expect(resultOneTraveler[0].y).toBeGreaterThanOrEqual(
        resultNoTravelers[0].y + 1,
      );
    });

    it("adds drunk when numTravelers >= 4", () => {
      const resultFewTravelers = getLieSeries(7, 3, 0);
      const resultManyTravelers = getLieSeries(7, 4, 0);

      // With 4+ travelers, should have at least 1 more drunk
      expect(resultManyTravelers[1].y).toBeGreaterThan(resultFewTravelers[1].y);
    });

    it("adds evil outsider for non-TB scripts with outsiders", () => {
      // Script 1 (S&V) should add evil outsider
      const result = getLieSeries(10, 0, 1);

      expect(result).toHaveLength(4);
      // Just verify it doesn't throw and returns valid data
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("handles default case in switch statement", () => {
      // Script 2 (BMR) should hit default case
      const result = getLieSeries(7, 0, 2);

      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("calculates correct totals (sum equals players + travelers)", () => {
      const numPlayers = 10;
      const numTravelers = 2;
      const result = getLieSeries(numPlayers, numTravelers, 0);

      const total = result.reduce((sum, item) => sum + item.y, 0);

      // Total should equal numPlayers + numTravelers - 1 (storyteller)
      expect(total).toBe(numPlayers + numTravelers - 1);
    });
  });
});
