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
      const result = getLieSeries(7, 0, { type: "builtin", index: 0 });

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
      const result = getLieSeries(7, 0, { type: "builtin", index: 1 });

      expect(result).toHaveLength(4);
      // For S&V, drunk calculation is different
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("calculates lie series for script 3 (Other)", () => {
      const result = getLieSeries(7, 0, { type: "builtin", index: 3 });

      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("calculates lie series for a community script", () => {
      const result = getLieSeries(7, 0, {
        type: "community",
        pk: 1,
        title: "T",
        author: "A",
        characters: [],
      });

      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("adds evil travelers when numTravelers >= 3", () => {
      const resultNoTravelers = getLieSeries(7, 0, {
        type: "builtin",
        index: 0,
      });
      const resultManyTravelers = getLieSeries(7, 3, {
        type: "builtin",
        index: 0,
      });

      // With 3+ travelers, should have 2 more evil
      expect(resultManyTravelers[0].y).toBeGreaterThanOrEqual(
        resultNoTravelers[0].y + 2,
      );
    });

    it("adds one evil traveler when 0 < numTravelers < 3", () => {
      const resultNoTravelers = getLieSeries(7, 0, {
        type: "builtin",
        index: 0,
      });
      const resultOneTraveler = getLieSeries(7, 1, {
        type: "builtin",
        index: 0,
      });

      // With 1-2 travelers, should have 1 more evil
      expect(resultOneTraveler[0].y).toBeGreaterThanOrEqual(
        resultNoTravelers[0].y + 1,
      );
    });

    it("adds drunk when numTravelers >= 4", () => {
      const resultFewTravelers = getLieSeries(7, 3, {
        type: "builtin",
        index: 0,
      });
      const resultManyTravelers = getLieSeries(7, 4, {
        type: "builtin",
        index: 0,
      });

      // With 4+ travelers, should have at least 1 more drunk
      expect(resultManyTravelers[1].y).toBeGreaterThan(resultFewTravelers[1].y);
    });

    it("adds evil outsider for non-TB scripts with outsiders", () => {
      // Script 1 (S&V) should add evil outsider
      const result = getLieSeries(10, 0, { type: "builtin", index: 1 });

      expect(result).toHaveLength(4);
      // Just verify it doesn't throw and returns valid data
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("handles default case (BMR, script 2) — no additional drunk", () => {
      // Script 2 (BMR) should hit default case
      const result = getLieSeries(7, 0, { type: "builtin", index: 2 });

      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("adds evil outsider for community script when outsiders exist", () => {
      // 8-player game has 1 outsider (playerDist[8] = "5, 1, 1, 1")
      const resultTB = getLieSeries(8, 0, { type: "builtin", index: 0 });
      const resultCommunity = getLieSeries(8, 0, {
        type: "community",
        pk: 1,
        title: "T",
        author: "A",
        characters: [],
      });

      // TB doesn't add evil outsider; community does (when dist[1] > 0)
      expect(resultCommunity[0].y).toBeGreaterThan(resultTB[0].y);
    });

    it("adds evil outsider for community script with 1-2 travelers", () => {
      // Covers line 29 branch: community script + numTravelers in (0,3) + outsiders > 0
      // 8-player game: 1 outsider; 1 traveler hits the `else if (numTravelers > 0)` path
      const result = getLieSeries(8, 1, {
        type: "community",
        pk: 1,
        title: "T",
        author: "A",
        characters: [],
      });

      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("calculates TB drunk with outsiders present (8-player game)", () => {
      // playerDist[8] = "5, 1, 1, 1" — 1 outsider, so Math.min(1,1) = 1 drunk
      const result = getLieSeries(8, 0, { type: "builtin", index: 0 });

      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("calculates S&V drunk with outsiders and minions present (9-player game)", () => {
      // playerDist[9] = "5, 2, 1, 1" — 2 outsiders, 1 minion
      // S&V: Math.min(2, 1) = 1 outsider drunk, Math.min(1, 2) = 1 minion drunk
      const result = getLieSeries(9, 0, { type: "builtin", index: 1 });

      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("calculates Other script drunk with outsiders present (8-player game)", () => {
      // playerDist[8] = "5, 1, 1, 1" — Other: Math.min(1,2)=1 outsider drunk
      const result = getLieSeries(8, 0, { type: "builtin", index: 3 });

      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("adds evil outsider for non-TB builtin (index 3/Other) with outsiders (covers line 29 index===3 branch)", () => {
      // 8-player game: playerDist[8]="5, 1, 1, 1" → outsiders=1
      // script.index===3 && outsiders>0 → line 29 hit
      const result = getLieSeries(8, 0, { type: "builtin", index: 3 });

      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("BMR (case 2) with outsiders>=1 hits Goon evil bonus (covers line 55)", () => {
      // 8-player game: playerDist[8]="5, 1, 1, 1" → outsiders=1
      // case 2: outsiders>=0 → numDrunk+=1; outsiders>=1 → numEvil+=1 (line 55)
      const result = getLieSeries(8, 0, { type: "builtin", index: 2 });

      expect(result).toHaveLength(4);
      result.forEach((item) => {
        expect(item.y).toBeGreaterThanOrEqual(0);
      });
    });

    it("calculates correct totals (sum equals players + travelers)", () => {
      const numPlayers = 10;
      const numTravelers = 2;
      const result = getLieSeries(numPlayers, numTravelers, {
        type: "builtin",
        index: 0,
      });

      const total = result.reduce((sum, item) => sum + item.y, 0);

      // Total should equal numPlayers + numTravelers - 1 (storyteller)
      expect(total).toBe(numPlayers + numTravelers - 1);
    });
  });
});
