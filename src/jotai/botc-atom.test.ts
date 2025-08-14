import { describe, it, expect } from "vitest";
import { newRoundNotes, newTracker, newBotCGame, BotCState } from "./botc-atom";

describe("botc-atom", () => {
  describe("newRoundNotes", () => {
    it("should create an array of 8 empty strings", () => {
      const result = newRoundNotes();

      expect(result).toHaveLength(8);
      expect(result.every((note) => note === "")).toBe(true);
    });

    it("should create a new array each time it's called", () => {
      const result1 = newRoundNotes();
      const result2 = newRoundNotes();

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });
  });

  describe("newTracker", () => {
    it("should create a 2D array with 8 rounds and 20 players", () => {
      const result = newTracker();

      expect(result).toHaveLength(8); // 8 rounds
      expect(result.every((round) => round.length === 20)).toBe(true); // 20 players per round
      expect(result.every((round) => round.every((value) => value === 0))).toBe(
        true,
      ); // All values should be 0
    });

    it("should create a new array each time it's called", () => {
      const result1 = newTracker();
      const result2 = newTracker();

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });
  });

  describe("newBotCGame", () => {
    it("should create a new game state with default values", () => {
      const result: BotCState = newBotCGame();

      expect(result.isText).toBe(true);
      expect(result.numPlayers).toBe(8);
      expect(result.numTravelers).toBe(0);
      expect(result.round).toBe(0);
      expect(result.script).toBe(0);
      expect(result.botcPlayers).toHaveLength(20);
      expect(result.roundNotes).toHaveLength(8);
      expect(result.tracker).toHaveLength(8);
    });

    it("should initialize roundNotes with empty strings", () => {
      const result = newBotCGame();

      expect(result.roundNotes).toEqual(["", "", "", "", "", "", "", ""]);
    });

    it("should initialize tracker with zeros", () => {
      const result = newBotCGame();

      expect(
        result.tracker.every((round) => round.every((value) => value === 0)),
      ).toBe(true);
    });

    it("should create a new game state each time it's called", () => {
      const result1 = newBotCGame();
      const result2 = newBotCGame();

      expect(result1).not.toBe(result2);
      expect(result1).toEqual(result2);
    });
  });
});
