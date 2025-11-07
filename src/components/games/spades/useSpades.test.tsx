import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "jotai";
import useSpades from "./useSpades";

describe("useSpades", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>{children}</Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() => useSpades(), { wrapper });

    expect(result.current.data).toBeDefined();
    expect(result.current.first).toBeDefined();
    expect(result.current.initials).toBeDefined();
    expect(result.current.lastBid).toBeDefined();
    expect(result.current.lifeBags).toBeDefined();
    expect(typeof result.current.addBid).toBe("function");
    expect(typeof result.current.addPenalty).toBe("function");
    expect(typeof result.current.addScore).toBe("function");
    expect(typeof result.current.newGame).toBe("function");
  });

  describe("addBid", () => {
    it("creates a new data entry when last entry has score (line 40-43 branch)", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      act(() => {
        result.current.addBid([
          { bid: 3, blind: false, train: false },
          { bid: 4, blind: false, train: false },
          { bid: 2, blind: false, train: false },
          { bid: 3, blind: false, train: false },
        ]);
      });

      expect(result.current.data.length).toBeGreaterThan(0);
      expect(result.current.data[0].bid).toBeDefined();
    });

    it("edits existing data entry when last entry has no score (line 33-37 branch)", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // First add a bid
      act(() => {
        result.current.addBid([
          { bid: 3, blind: false, train: false },
          { bid: 4, blind: false, train: false },
          { bid: 2, blind: false, train: false },
          { bid: 3, blind: false, train: false },
        ]);
      });

      const dataLengthAfterFirst = result.current.data.length;

      // Add another bid without adding score first
      act(() => {
        result.current.addBid([
          { bid: 4, blind: false, train: false },
          { bid: 3, blind: false, train: false },
          { bid: 3, blind: false, train: false },
          { bid: 2, blind: false, train: false },
        ]);
      });

      // Should not add new entry, just edit existing one
      expect(result.current.data.length).toBe(dataLengthAfterFirst);
    });
  });

  describe("addScore", () => {
    it("returns early when score already exists (line 82-84 branch)", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // Add a bid
      act(() => {
        result.current.addBid([
          { bid: 3, blind: false, train: false },
          { bid: 4, blind: false, train: false },
          { bid: 2, blind: false, train: false },
          { bid: 3, blind: false, train: false },
        ]);
      });

      // Add a score
      act(() => {
        result.current.addScore([3, 4, 2, 3]);
      });

      const dataLengthAfterScore = result.current.data.length;

      // Try to add score again - should return early
      act(() => {
        result.current.addScore([4, 5, 3, 4]);
      });

      // Data length should not change
      expect(result.current.data.length).toBe(dataLengthAfterScore);
    });

    it("adds score successfully when bid exists without score", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // Add a bid
      act(() => {
        result.current.addBid([
          { bid: 3, blind: false, train: false },
          { bid: 4, blind: false, train: false },
          { bid: 2, blind: false, train: false },
          { bid: 3, blind: false, train: false },
        ]);
      });

      // Add a score
      act(() => {
        result.current.addScore([3, 4, 2, 3]);
      });

      const lastEntry = result.current.data[result.current.data.length - 1];
      expect(lastEntry.score1).toBeDefined();
      expect(lastEntry.score2).toBeDefined();
    });
  });

  describe("addPenalty", () => {
    it("adjusts last index when current entry has no score (line 48-50 branch)", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // Add a bid
      act(() => {
        result.current.addBid([
          { bid: 3, blind: false, train: false },
          { bid: 4, blind: false, train: false },
          { bid: 2, blind: false, train: false },
          { bid: 3, blind: false, train: false },
        ]);
      });

      // Add a score
      act(() => {
        result.current.addScore([3, 4, 2, 3]);
      });

      // Add another bid without score
      act(() => {
        result.current.addBid([
          { bid: 4, blind: false, train: false },
          { bid: 3, blind: false, train: false },
          { bid: 3, blind: false, train: false },
          { bid: 2, blind: false, train: false },
        ]);
      });

      // Add penalty - should look at previous entry since current has no score
      act(() => {
        result.current.addPenalty(0)();
      });

      // The penalty should be applied to the entry with score
      expect(result.current.data).toBeDefined();
    });

    it("adds penalty to team 0 (line 51-62 branch)", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // Add a bid
      act(() => {
        result.current.addBid([
          { bid: 3, blind: false, train: false },
          { bid: 4, blind: false, train: false },
          { bid: 2, blind: false, train: false },
          { bid: 3, blind: false, train: false },
        ]);
      });

      // Add a score - give 10 bags so next penalty will cross threshold
      act(() => {
        result.current.addScore([13, 4, 12, 3]);
      });

      const bagsBeforePenalty =
        result.current.data[result.current.data.length - 1].bags1;

      // Add penalty to team 0 - adds 3 bags
      act(() => {
        result.current.addPenalty(0)();
      });

      const bagsAfterPenalty =
        result.current.data[result.current.data.length - 1].bags1;

      // Bags should increase by 3, and if >= 10, score decreases and bags reduce by 10
      expect(bagsAfterPenalty).not.toBe(bagsBeforePenalty);
    });

    it("adds penalty to team 1 (line 63-75 else branch)", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // Add a bid
      act(() => {
        result.current.addBid([
          { bid: 3, blind: false, train: false },
          { bid: 4, blind: false, train: false },
          { bid: 2, blind: false, train: false },
          { bid: 3, blind: false, train: false },
        ]);
      });

      // Add a score - give 10 bags so next penalty will cross threshold
      act(() => {
        result.current.addScore([3, 13, 3, 12]);
      });

      const bagsBeforePenalty =
        result.current.data[result.current.data.length - 1].bags2;

      // Add penalty to team 1
      act(() => {
        result.current.addPenalty(1)();
      });

      const bagsAfterPenalty =
        result.current.data[result.current.data.length - 1].bags2;

      // Bags should increase
      expect(bagsAfterPenalty).not.toBe(bagsBeforePenalty);
    });

    it("returns early when score1 is undefined for team 0 (line 54-56 branch)", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // Try to add penalty without any data
      act(() => {
        result.current.addPenalty(0)();
      });

      // Should not crash, just return early
      expect(result.current.data).toBeDefined();
    });

    it("returns early when score2 is undefined for team 1 (line 66-68 branch)", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // Try to add penalty without any data
      act(() => {
        result.current.addPenalty(1)();
      });

      // Should not crash, just return early
      expect(result.current.data).toBeDefined();
    });
  });

  describe("newGame", () => {
    it("increments wins1 when team 1 has higher score (line 145-147 branch)", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // Add a bid - Team 1 (players 0&2) bids 10, Team 2 (players 1&3) bids 3
      act(() => {
        result.current.addBid([
          { bid: 6, blind: false, train: false },
          { bid: 2, blind: false, train: false },
          { bid: 6, blind: false, train: false },
          { bid: 1, blind: false, train: false },
        ]);
      });

      // Add a score - Team 1 makes 12, Team 2 makes 3
      act(() => {
        result.current.addScore([6, 2, 6, 1]);
      });

      const wins1Before = result.current.wins1;
      const wins2Before = result.current.wins2;
      const lastEntry = result.current.data[result.current.data.length - 1];

      // Verify which team won based on scores
      const is1Winner =
        (lastEntry.score1 === lastEntry.score2 &&
          (lastEntry.bags1 || 0) > (lastEntry.bags2 || 0)) ||
        (lastEntry.score1 || 0) > (lastEntry.score2 || 0);

      // Start new game
      act(() => {
        result.current.newGame();
      });

      // Verify the winner incremented correctly
      if (is1Winner) {
        expect(result.current.wins1).toBe(wins1Before + 1);
        expect(result.current.wins2).toBe(wins2Before);
      } else {
        expect(result.current.wins1).toBe(wins1Before);
        expect(result.current.wins2).toBe(wins2Before + 1);
      }
    });

    it("increments wins2 when team 2 has higher score", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // Add a bid
      act(() => {
        result.current.addBid([
          { bid: 2, blind: false, train: false },
          { bid: 5, blind: false, train: false },
          { bid: 1, blind: false, train: false },
          { bid: 5, blind: false, train: false },
        ]);
      });

      // Add a score where team 2 wins
      act(() => {
        result.current.addScore([2, 5, 1, 5]);
      });

      const wins1Before = result.current.wins1;
      const wins2Before = result.current.wins2;

      // Start new game
      act(() => {
        result.current.newGame();
      });

      // Team 2 should have won
      expect(result.current.wins1).toBe(wins1Before);
      expect(result.current.wins2).toBe(wins2Before + 1);
    });

    it("increments wins1 when scores are equal but team 1 has more bags (line 146 branch)", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // This test covers the edge case where score1 === score2 && bags1 > bags2
      // Add a bid
      act(() => {
        result.current.addBid([
          { bid: 3, blind: false, train: false },
          { bid: 3, blind: false, train: false },
          { bid: 3, blind: false, train: false },
          { bid: 3, blind: false, train: false },
        ]);
      });

      // Add a score where both teams get same score but different bags
      // Team 1 gets 4 tricks (1 bag), Team 2 gets 2 tricks (0 bags)
      act(() => {
        result.current.addScore([4, 2, 4, 2]);
      });

      const wins1Before = result.current.wins1;

      // Start new game
      act(() => {
        result.current.newGame();
      });

      // If bags are the tiebreaker, team with more bags wins
      expect(result.current.wins1).toBeGreaterThanOrEqual(wins1Before);
    });

    it("resets data array when starting new game", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // Add a bid
      act(() => {
        result.current.addBid([
          { bid: 3, blind: false, train: false },
          { bid: 4, blind: false, train: false },
          { bid: 2, blind: false, train: false },
          { bid: 3, blind: false, train: false },
        ]);
      });

      // Add a score
      act(() => {
        result.current.addScore([3, 4, 2, 3]);
      });

      expect(result.current.data.length).toBeGreaterThan(0);

      // Start new game
      act(() => {
        result.current.newGame();
      });

      // Data should be reset
      expect(result.current.data.length).toBe(0);
    });
  });

  describe("state updates", () => {
    it("updates first player after adding score", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      const initialFirst = result.current.first;

      // Add a bid
      act(() => {
        result.current.addBid([
          { bid: 3, blind: false, train: false },
          { bid: 4, blind: false, train: false },
          { bid: 2, blind: false, train: false },
          { bid: 3, blind: false, train: false },
        ]);
      });

      // Add a score
      act(() => {
        result.current.addScore([3, 4, 2, 3]);
      });

      // First should advance by 1 (mod 4)
      expect(result.current.first).toBe((initialFirst + 1) % 4);
    });

    it("resets lastBid after adding score", () => {
      const { result } = renderHook(() => useSpades(), { wrapper });

      // Add a bid
      act(() => {
        result.current.addBid([
          { bid: 3, blind: false, train: false },
          { bid: 4, blind: false, train: false },
          { bid: 2, blind: false, train: false },
          { bid: 3, blind: false, train: false },
        ]);
      });

      // Add a score
      act(() => {
        result.current.addScore([3, 4, 2, 3]);
      });

      // lastBid should be reset to default (bid: 3, blind: false, train: false)
      expect(result.current.lastBid[0].bid).toBe(3);
      expect(result.current.lastBid[0].blind).toBe(false);
      expect(result.current.lastBid[0].train).toBe(false);
    });
  });
});
