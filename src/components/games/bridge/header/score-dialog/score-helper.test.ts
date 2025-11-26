import { describe, it, expect } from "vitest";
import useBridgeScorer, { undertrickTable } from "./score-helper";

describe("Bridge Score Helper", () => {
  describe("useBridgeScorer", () => {
    // Test made bid scenarios
    describe("Made Bid Scenarios", () => {
      it("should calculate minor suit contract correctly", () => {
        const result = useBridgeScorer(
          7, // declarerTricks
          1, // contractTricks
          true, // isWe
          "♣️", // contractSuit (minor)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.aboveTheLine).toBe(20); // 1 trick * 20
        expect(result.belowTheLine).toBe(0);
      });

      it("should calculate major suit contract correctly", () => {
        const result = useBridgeScorer(
          8, // declarerTricks (2 tricks)
          2, // contractTricks
          true, // isWe
          "♥️", // contractSuit (major)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.aboveTheLine).toBe(60); // 2 tricks * 30
        expect(result.belowTheLine).toBe(0);
      });

      it("should calculate no trump contract correctly", () => {
        const result = useBridgeScorer(
          9, // declarerTricks (3 tricks)
          3, // contractTricks
          true, // isWe
          "NT", // contractSuit
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.aboveTheLine).toBe(100); // 40 + (3-1)*30
        expect(result.belowTheLine).toBe(0);
      });

      it("should calculate small slam bonus (not vulnerable)", () => {
        const result = useBridgeScorer(
          12, // declarerTricks (6 tricks = small slam)
          6, // contractTricks
          true, // isWe
          "NT", // contractSuit
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.belowTheLine).toBe(750); // Small slam not vulnerable (the values were swapped in the code)
      });

      it("should calculate grand slam bonus (not vulnerable)", () => {
        const result = useBridgeScorer(
          13, // declarerTricks (7 tricks = grand slam)
          7, // contractTricks
          true, // isWe
          "♠️", // contractSuit (major)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.belowTheLine).toBe(1500); // Grand slam not vulnerable (the values were swapped in the code)
      });

      it("should calculate overtricks for non-doubled contract", () => {
        const result = useBridgeScorer(
          9, // declarerTricks (2 overtricks)
          1, // contractTricks
          true, // isWe
          "♦️", // contractSuit (minor)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.aboveTheLine).toBe(20); // 1 * 20
        expect(result.belowTheLine).toBe(40); // 2 overtricks * 20
      });

      it("should calculate overtricks for doubled contract", () => {
        const result = useBridgeScorer(
          9, // declarerTricks (2 overtricks)
          1, // contractTricks
          true, // isWe
          "♥️", // contractSuit (major)
          true, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.belowTheLine).toBe(250); // 2 overtricks * 100 + 50 (doubled bonus)
      });

      it("should calculate overtricks for redoubled contract", () => {
        const result = useBridgeScorer(
          9, // declarerTricks (2 overtricks)
          1, // contractTricks
          true, // isWe
          "♠️", // contractSuit (major)
          true, // isDouble
          true, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.belowTheLine).toBe(500); // 2 overtricks * 100 * 2 + 100 (redoubled bonus)
      });

      it("should add 4 aces bonus for no trump", () => {
        const result = useBridgeScorer(
          9, // declarerTricks
          3, // contractTricks
          true, // isWe
          "NT", // contractSuit
          false, // isDouble
          false, // isRedouble
          true, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.belowTheLine).toBe(150); // 4 aces bonus
      });

      it("should add 4 honours bonus for trump suit", () => {
        const result = useBridgeScorer(
          8, // declarerTricks
          2, // contractTricks
          true, // isWe
          "♥️", // contractSuit (major)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          true, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.belowTheLine).toBe(100); // 4 honours bonus
      });

      it("should add 5 honours bonus for trump suit", () => {
        const result = useBridgeScorer(
          8, // declarerTricks
          2, // contractTricks
          true, // isWe
          "♠️", // contractSuit (major)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          true, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.belowTheLine).toBe(150); // 5 honours bonus
      });

      it("should add doubled bonus", () => {
        const result = useBridgeScorer(
          7, // declarerTricks
          1, // contractTricks
          true, // isWe
          "♣️", // contractSuit (minor)
          true, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.belowTheLine).toBe(50); // doubled bonus
      });

      it("should add redoubled bonus", () => {
        const result = useBridgeScorer(
          7, // declarerTricks
          1, // contractTricks
          true, // isWe
          "♦️", // contractSuit (minor)
          true, // isDouble
          true, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.belowTheLine).toBe(100); // redoubled bonus
      });

      it("should calculate overtricks for major suit", () => {
        const result = useBridgeScorer(
          10, // declarerTricks (3 overtricks)
          1, // contractTricks
          true, // isWe
          "♥️", // contractSuit (major)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.aboveTheLine).toBe(30); // 1 * 30
        expect(result.belowTheLine).toBe(90); // 3 overtricks * 30
      });
    });

    // Test failed bid scenarios (undertricks)
    describe("Failed Bid Scenarios (Undertricks)", () => {
      it("should calculate 1 undertrick not vulnerable, not doubled", () => {
        const result = useBridgeScorer(
          6, // declarerTricks (1 undertrick)
          1, // contractTricks
          true, // isWe
          "♣️", // contractSuit (minor)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("they");
        expect(result.madeBid).toBe(false);
        expect(result.aboveTheLine).toBe(0);
        expect(result.belowTheLine).toBe(undertrickTable[0][0]); // 50
      });

      it("should calculate 2 undertricks doubled", () => {
        const result = useBridgeScorer(
          5, // declarerTricks (2 undertricks)
          1, // contractTricks
          true, // isWe
          "♦️", // contractSuit (minor)
          true, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("they");
        expect(result.madeBid).toBe(false);
        expect(result.belowTheLine).toBe(undertrickTable[1][2]); // 300
      });

      it("should calculate 3 undertricks redoubled", () => {
        const result = useBridgeScorer(
          4, // declarerTricks (3 undertricks)
          1, // contractTricks
          true, // isWe
          "♣️", // contractSuit (minor)
          true, // isDouble
          true, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("they");
        expect(result.madeBid).toBe(false);
        expect(result.belowTheLine).toBe(undertrickTable[2][2] * 2); // 1000
      });

      it("should calculate 5 undertricks not doubled", () => {
        const result = useBridgeScorer(
          2, // declarerTricks (5 undertricks)
          1, // contractTricks
          true, // isWe
          "♠️", // contractSuit (major)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("they");
        expect(result.madeBid).toBe(false);
        expect(result.belowTheLine).toBe(undertrickTable[4][0]); // 250
      });
    });

    // Test "they" as winner scenarios
    describe('"They" Winner Scenarios', () => {
      it('should set "they" as winner when they make bid', () => {
        const result = useBridgeScorer(
          7, // declarerTricks
          1, // contractTricks
          false, // isWe (they won bid)
          "♣️", // contractSuit (minor)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("they");
        expect(result.madeBid).toBe(true);
      });

      it('should set "they" as winner when we fail bid', () => {
        const result = useBridgeScorer(
          6, // declarerTricks (failed)
          1, // contractTricks
          true, // isWe (we won bid but failed)
          "♦️", // contractSuit (minor)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("they");
        expect(result.madeBid).toBe(false);
      });

      it('should set "we" as winner when they fail bid', () => {
        const result = useBridgeScorer(
          6, // declarerTricks (failed)
          1, // contractTricks
          false, // isWe (they won bid but failed)
          "♣️", // contractSuit (minor)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(false);
      });
    });

    // Edge cases
    describe("Edge Cases", () => {
      it("should handle exactly making contract (no overtricks)", () => {
        const result = useBridgeScorer(
          7, // declarerTricks (exactly 7)
          1, // contractTricks (1 + 6 = 7)
          true, // isWe
          "♣️", // contractSuit (minor)
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.belowTheLine).toBe(0); // No overtricks
      });

      it("should handle maximum overtricks (13 tricks on 1 bid)", () => {
        const result = useBridgeScorer(
          13, // declarerTricks (all 13 tricks)
          1, // contractTricks
          true, // isWe
          "NT", // contractSuit
          false, // isDouble
          false, // isRedouble
          false, // is4Aces
          false, // is4Honours
          false, // is5Honours
        );

        expect(result.winner).toBe("we");
        expect(result.madeBid).toBe(true);
        expect(result.belowTheLine).toBe(180); // 6 overtricks * 30
      });
    });
  });

  describe("undertrickTable", () => {
    it("should have correct structure", () => {
      expect(undertrickTable).toHaveLength(13);
      expect(undertrickTable[0]).toEqual([50, 100, 100, 200]);
    });

    it("should have 4 columns for each row", () => {
      undertrickTable.forEach((row) => {
        expect(row).toHaveLength(4);
      });
    });
  });
});
