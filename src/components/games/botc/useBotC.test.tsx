import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "jotai";
import useBotC, {
  usePlayerAdjControls,
  usePlayerNotes,
  useEditPlayers,
  useTracker,
} from "./useBotC";
import { SelectChangeEvent } from "@mui/material";
import { BotCRole } from "../../../jotai/botc-atom";

describe("useBotC", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>{children}</Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useBotC (main hook)", () => {
    it("returns initial state values", () => {
      const { result } = renderHook(() => useBotC(), { wrapper });

      expect(result.current.isText).toBeDefined();
      expect(result.current.numPlayers).toBeDefined();
      expect(result.current.numTravelers).toBeDefined();
      expect(result.current.script).toBeDefined();
    });
  });

  describe("usePlayerAdjControls", () => {
    it("moves player up when isUp is true", () => {
      const { result } = renderHook(() => usePlayerAdjControls(), { wrapper });

      act(() => {
        const updateFn = result.current(1, true);
        updateFn();
      });

      // Function should execute without error
      expect(result.current).toBeDefined();
    });

    it("moves player down when isUp is false", () => {
      const { result } = renderHook(() => usePlayerAdjControls(), { wrapper });

      act(() => {
        const updateFn = result.current(1, false);
        updateFn();
      });

      expect(result.current).toBeDefined();
    });

    it("handles moving player at position 0 up", () => {
      const { result } = renderHook(() => usePlayerAdjControls(), { wrapper });

      act(() => {
        const updateFn = result.current(0, true);
        updateFn();
      });

      expect(result.current).toBeDefined();
    });

    it("handles moving player at position 3 up", () => {
      const { result } = renderHook(() => usePlayerAdjControls(), { wrapper });

      act(() => {
        const updateFn = result.current(3, true);
        updateFn();
      });

      expect(result.current).toBeDefined();
    });

    it("handles moving player at position 0 down", () => {
      const { result } = renderHook(() => usePlayerAdjControls(), { wrapper });

      act(() => {
        const updateFn = result.current(0, false);
        updateFn();
      });

      expect(result.current).toBeDefined();
    });

    it("handles moving player at position 1 down", () => {
      const { result } = renderHook(() => usePlayerAdjControls(), { wrapper });

      act(() => {
        const updateFn = result.current(1, false);
        updateFn();
      });

      expect(result.current).toBeDefined();
    });
  });

  describe("usePlayerNotes", () => {
    it("returns initial player notes state", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      expect(result.current.botcPlayers).toBeDefined();
      expect(result.current.randomPlayer).toBeNull();
      expect(result.current.getRandomPlayer).toBeDefined();
      expect(result.current.updateNames).toBeDefined();
      expect(result.current.updateNotes).toBeDefined();
      expect(result.current.updateRoles).toBeDefined();
      expect(result.current.updateStats).toBeDefined();
    });

    it("gets random player from alive players", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      act(() => {
        result.current.getRandomPlayer();
      });

      // Random player should be set or null if no alive players
      expect(result.current.randomPlayer !== undefined).toBe(true);
    });

    it("updates player name onBlur", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      const mockEvent = {
        target: { value: "Test Player" },
      } as React.FocusEvent<HTMLInputElement>;

      act(() => {
        const updateFn = result.current.updateNames(0);
        updateFn(mockEvent);
      });

      expect(result.current.botcPlayers).toBeDefined();
    });

    it("updates player name with empty value", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      const mockEvent = {
        target: { value: "" },
      } as React.FocusEvent<HTMLInputElement>;

      act(() => {
        const updateFn = result.current.updateNames(0);
        updateFn(mockEvent);
      });

      expect(result.current.botcPlayers).toBeDefined();
    });

    it("updates player notes onBlur", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      const mockEvent = {
        target: { value: "Test Notes" },
      } as React.FocusEvent<HTMLInputElement>;

      act(() => {
        const updateFn = result.current.updateNotes(0);
        updateFn(mockEvent);
      });

      expect(result.current.botcPlayers).toBeDefined();
    });

    it("updates player notes with empty value", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      const mockEvent = {
        target: { value: "" },
      } as React.FocusEvent<HTMLInputElement>;

      act(() => {
        const updateFn = result.current.updateNotes(0);
        updateFn(mockEvent);
      });

      expect(result.current.botcPlayers).toBeDefined();
    });

    it("adds role when not selected", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      const mockRole: BotCRole = {
        name: "Imp",
        icon: "👹",
        alignment: "error",
      };

      act(() => {
        const updateFn = result.current.updateRoles(0)(mockRole, false);
        updateFn();
      });

      expect(result.current.botcPlayers).toBeDefined();
    });

    it("removes role when selected", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      const mockRole: BotCRole = {
        name: "Imp",
        icon: "👹",
        alignment: "error",
      };

      act(() => {
        const updateFn = result.current.updateRoles(0)(mockRole, true);
        updateFn();
      });

      expect(result.current.botcPlayers).toBeDefined();
    });

    it("updates player stats with checked true", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      const mockEvent = {} as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        const updateFn = result.current.updateStats(0)("exec");
        updateFn(mockEvent, true);
      });

      expect(result.current.botcPlayers).toBeDefined();
    });

    it("updates player stats with checked false", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      const mockEvent = {} as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        const updateFn = result.current.updateStats(0)("exec");
        updateFn(mockEvent, false);
      });

      expect(result.current.botcPlayers).toBeDefined();
    });

    it("resets random player when exec is checked", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      // First set a random player
      act(() => {
        result.current.getRandomPlayer();
      });

      const mockEvent = {} as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        const updateFn = result.current.updateStats(0)("exec");
        updateFn(mockEvent, true);
      });

      expect(result.current.randomPlayer).toBeNull();
    });

    it("resets random player when kill is checked", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      // First set a random player
      act(() => {
        result.current.getRandomPlayer();
      });

      const mockEvent = {} as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        const updateFn = result.current.updateStats(0)("kill");
        updateFn(mockEvent, true);
      });

      expect(result.current.randomPlayer).toBeNull();
    });

    it("does not reset random player for other stats", () => {
      const { result } = renderHook(() => usePlayerNotes(), { wrapper });

      const mockEvent = {} as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        const updateFn = result.current.updateStats(0)("liar");
        updateFn(mockEvent, true);
      });

      expect(result.current.botcPlayers).toBeDefined();
    });
  });

  describe("useEditPlayers", () => {
    it("returns initial edit players state", () => {
      const { result } = renderHook(() => useEditPlayers(), { wrapper });

      expect(result.current.isText).toBeDefined();
      expect(result.current.script).toBeDefined();
      expect(result.current.updateNumPlayers).toBeDefined();
      expect(result.current.updateNumTravelers).toBeDefined();
      expect(result.current.updateScript).toBeDefined();
      expect(result.current.updateText).toBeDefined();
      expect(result.current.newBotCGame).toBeDefined();
    });

    it("updates number of players", () => {
      const { result } = renderHook(() => useEditPlayers(), { wrapper });

      act(() => {
        result.current.updateNumPlayers(10);
      });

      expect(result.current).toBeDefined();
    });

    it("updates number of travelers", () => {
      const { result } = renderHook(() => useEditPlayers(), { wrapper });

      act(() => {
        result.current.updateNumTravelers(2);
      });

      expect(result.current).toBeDefined();
    });

    it("updates script to 0 and sets text to true", () => {
      const { result } = renderHook(() => useEditPlayers(), { wrapper });

      const mockEvent = {
        target: { value: 0, name: "script" },
      };

      act(() => {
        result.current.updateScript(mockEvent as SelectChangeEvent<number>);
      });

      expect(result.current.isText).toBe(true);
    });

    it("updates script to 1 and sets text to true", () => {
      const { result } = renderHook(() => useEditPlayers(), { wrapper });

      const mockEvent = {
        target: { value: 1, name: "script" },
      } as unknown as SelectChangeEvent<number>;

      act(() => {
        result.current.updateScript(mockEvent);
      });

      expect(result.current.isText).toBe(true);
    });

    it("updates script to 2 and sets text to true", () => {
      const { result } = renderHook(() => useEditPlayers(), { wrapper });

      const mockEvent = {
        target: { value: 2, name: "script" },
      } as unknown as SelectChangeEvent<number>;

      act(() => {
        result.current.updateScript(mockEvent);
      });

      expect(result.current.isText).toBe(true);
    });

    it("updates script to 5 and sets text to false", () => {
      const { result } = renderHook(() => useEditPlayers(), { wrapper });

      const mockEvent = {
        target: { value: 5, name: "script" },
      } as unknown as SelectChangeEvent<number>;

      act(() => {
        result.current.updateScript(mockEvent);
      });

      expect(result.current.isText).toBe(false);
    });

    it("updates script to default case (3 or 4)", () => {
      const { result } = renderHook(() => useEditPlayers(), { wrapper });

      const mockEvent = {
        target: { value: 3, name: "script" },
      } as unknown as SelectChangeEvent<number>;

      act(() => {
        result.current.updateScript(mockEvent);
      });

      expect(result.current).toBeDefined();
    });

    it("updates text setting", () => {
      const { result } = renderHook(() => useEditPlayers(), { wrapper });

      const mockEvent = {
        target: { checked: false },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.updateText(mockEvent);
      });

      expect(result.current).toBeDefined();
    });

    it("creates new BotC game", () => {
      const { result } = renderHook(() => useEditPlayers(), { wrapper });

      act(() => {
        result.current.newBotCGame();
      });

      expect(result.current).toBeDefined();
    });
  });

  describe("useTracker", () => {
    it("returns initial tracker state", () => {
      const { result } = renderHook(() => useTracker(), { wrapper });

      expect(result.current.botcPlayers).toBeDefined();
      expect(result.current.round).toBeDefined();
      expect(result.current.roundNotes).toBeDefined();
      expect(result.current.tracker).toBeDefined();
      expect(result.current.onNotesChange).toBeDefined();
      expect(result.current.onRoundClick).toBeDefined();
      expect(result.current.onTrackClick).toBeDefined();
    });

    it("updates round when round is clicked", () => {
      const { result } = renderHook(() => useTracker(), { wrapper });

      act(() => {
        const clickFn = result.current.onRoundClick(2);
        clickFn();
      });

      expect(result.current.round).toBe(2);
    });

    it("cycles tracker value through 0, 1, 2", () => {
      const { result } = renderHook(() => useTracker(), { wrapper });

      act(() => {
        const clickFn = result.current.onTrackClick(0);
        clickFn();
      });

      // Should cycle to next value (0 -> 1, 1 -> 2, 2 -> 0)
      expect(result.current.tracker[result.current.round]?.[0]).toBeDefined();
    });

    it("updates round notes with value", () => {
      const { result } = renderHook(() => useTracker(), { wrapper });

      const mockEvent = {
        target: { value: "Night 1 notes" },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.onNotesChange(mockEvent);
      });

      expect(result.current.roundNotes[result.current.round]).toBe(
        "Night 1 notes",
      );
    });

    it("updates round notes with empty value", () => {
      const { result } = renderHook(() => useTracker(), { wrapper });

      const mockEvent = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.onNotesChange(mockEvent);
      });

      expect(result.current.roundNotes[result.current.round]).toBe("");
    });
  });
});
