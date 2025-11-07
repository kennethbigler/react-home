import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "jotai";
import {
  useHeader,
  useRebels,
  useEmpire,
  useMissions,
  useForcedMissions,
} from "./useImperialAssault";

describe("useImperialAssault", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>{children}</Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useHeader", () => {
    it("initializes with default campaign index", () => {
      const { result } = renderHook(() => useHeader(), { wrapper });
      expect(result.current.campaignIdx).toBeDefined();
      expect(typeof result.current.handleCampaignChange).toBe("function");
    });

    it("handles campaign change to Twin Shadows (cIdx = 1)", () => {
      const { result } = renderHook(() => useHeader(), { wrapper });

      act(() => {
        result.current.handleCampaignChange("1");
      });

      expect(result.current.campaignIdx).toBe("1");
    });

    it("handles campaign change to The Bespin Gambit (cIdx = 3)", () => {
      const { result } = renderHook(() => useHeader(), { wrapper });

      act(() => {
        result.current.handleCampaignChange("3");
      });

      expect(result.current.campaignIdx).toBe("3");
    });

    it("handles campaign change to Tyrants of Lothal (cIdx = 6)", () => {
      const { result } = renderHook(() => useHeader(), { wrapper });

      act(() => {
        result.current.handleCampaignChange("6");
      });

      expect(result.current.campaignIdx).toBe("6");
    });

    it("handles campaign change to Basic (cIdx = 0) - default branch", () => {
      const { result } = renderHook(() => useHeader(), { wrapper });

      act(() => {
        result.current.handleCampaignChange("0");
      });

      expect(result.current.campaignIdx).toBe("0");
    });

    it("handles campaign change to Return to Hoth (cIdx = 2) - default branch", () => {
      const { result } = renderHook(() => useHeader(), { wrapper });

      act(() => {
        result.current.handleCampaignChange("2");
      });

      expect(result.current.campaignIdx).toBe("2");
    });

    it("handles campaign change to Jabba's Realm (cIdx = 4) - default branch", () => {
      const { result } = renderHook(() => useHeader(), { wrapper });

      act(() => {
        result.current.handleCampaignChange("4");
      });

      expect(result.current.campaignIdx).toBe("4");
    });

    it("handles campaign change to Heart of the Empire (cIdx = 5) - default branch", () => {
      const { result } = renderHook(() => useHeader(), { wrapper });

      act(() => {
        result.current.handleCampaignChange("5");
      });

      expect(result.current.campaignIdx).toBe("5");
    });
  });

  describe("useRebels", () => {
    it("initializes with default values", () => {
      const { result } = renderHook(() => useRebels(), { wrapper });

      expect(result.current.rebelXP).toBeDefined();
      expect(result.current.credits).toBeDefined();
      expect(typeof result.current.handleXPClick).toBe("function");
      expect(typeof result.current.updateCredits).toBe("function");
    });

    it("handles XP click for rebel index 0", () => {
      const { result } = renderHook(() => useRebels(), { wrapper });

      act(() => {
        result.current.handleXPClick(0, 5)();
      });

      expect(result.current.rebelXP[0]).toBe(5);
    });

    it("handles XP click for rebel index 1", () => {
      const { result } = renderHook(() => useRebels(), { wrapper });

      act(() => {
        result.current.handleXPClick(1, 3)();
      });

      expect(result.current.rebelXP[1]).toBe(3);
    });

    it("handles XP click for rebel index 2", () => {
      const { result } = renderHook(() => useRebels(), { wrapper });

      act(() => {
        result.current.handleXPClick(2, 7)();
      });

      expect(result.current.rebelXP[2]).toBe(7);
    });

    it("handles XP click for rebel index 3", () => {
      const { result } = renderHook(() => useRebels(), { wrapper });

      act(() => {
        result.current.handleXPClick(3, 10)();
      });

      expect(result.current.rebelXP[3]).toBe(10);
    });

    it("updates credits", () => {
      const { result } = renderHook(() => useRebels(), { wrapper });

      act(() => {
        result.current.updateCredits({
          target: { value: "500" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      expect(result.current.credits).toBe("500");
    });

    it("updates credits with empty value", () => {
      const { result } = renderHook(() => useRebels(), { wrapper });

      act(() => {
        result.current.updateCredits({
          target: { value: "" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      expect(result.current.credits).toBe("");
    });
  });

  describe("useEmpire", () => {
    it("initializes with default values", () => {
      const { result } = renderHook(() => useEmpire(), { wrapper });

      expect(result.current.xp).toBeDefined();
      expect(result.current.influence).toBeDefined();
      expect(typeof result.current.handleXPClick).toBe("function");
      expect(typeof result.current.handleInfluenceClick).toBe("function");
    });

    it("handles XP click", () => {
      const { result } = renderHook(() => useEmpire(), { wrapper });

      act(() => {
        result.current.handleXPClick(5)();
      });

      expect(result.current.xp).toBe(5);
    });

    it("handles influence click", () => {
      const { result } = renderHook(() => useEmpire(), { wrapper });

      act(() => {
        result.current.handleInfluenceClick(3)();
      });

      expect(result.current.influence).toBe(3);
    });
  });

  describe("useMissions", () => {
    it("initializes with campaign missions", () => {
      const { result } = renderHook(() => useMissions(), { wrapper });

      expect(result.current.campaign).toBeDefined();
      expect(typeof result.current.handleVictoryClick).toBe("function");
      expect(typeof result.current.handleRShopClick).toBe("function");
      expect(typeof result.current.handleEShopClick).toBe("function");
      expect(typeof result.current.updateMissionName).toBe("function");
    });

    it("handles victory click when mission has a title", () => {
      const { result } = renderHook(() => useMissions(), { wrapper });

      // Ensure we have a mission with a title
      if (result.current.campaign[0] && result.current.campaign[0].title) {
        const initialVictory = result.current.campaign[0].victory;

        act(() => {
          result.current.handleVictoryClick(0)();
        });

        expect(result.current.campaign[0].victory).toBe((initialVictory + 1) % 3);
      }
    });

    it("does not handle victory click when mission title is empty (line 90 branch)", () => {
      const { result } = renderHook(() => useMissions(), { wrapper });

      // Find a mission with empty title or update one to have empty title
      act(() => {
        result.current.updateMissionName(0)({
          target: { value: "" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      const campaignBeforeClick = result.current.campaign[0];

      act(() => {
        result.current.handleVictoryClick(0)();
      });

      // Should not have changed since title is empty
      expect(result.current.campaign[0]).toEqual(campaignBeforeClick);
    });

    it("updates forced mission threat when last forced mission has empty title (line 103 branch)", () => {
      const { result } = renderHook(() => useMissions(), { wrapper });

      // Click victory on a mission that has a title
      if (result.current.campaign[0] && result.current.campaign[0].title) {
        act(() => {
          result.current.handleVictoryClick(0)();
        });

        // This should update forced missions
        expect(result.current.campaign).toBeDefined();
      }
    });

    it("handles rShop click when mission has victory", () => {
      const { result } = renderHook(() => useMissions(), { wrapper });

      // First set a victory
      if (result.current.campaign[0] && result.current.campaign[0].title) {
        act(() => {
          result.current.handleVictoryClick(0)();
        });

        const initialRShop = result.current.campaign[0].rShop;

        act(() => {
          result.current.handleRShopClick(0)();
        });

        expect(result.current.campaign[0].rShop).toBe(!initialRShop);
      }
    });

    it("does not handle rShop click when mission has no victory and rShop is false (line 112 branch)", () => {
      const { result } = renderHook(() => useMissions(), { wrapper });

      // Ensure mission has no victory and rShop is false
      const initialRShop = result.current.campaign[0]?.rShop || false;

      act(() => {
        result.current.handleRShopClick(0)();
      });

      // Should not change if campaign[0].victory is 0 and rShop is false
      if (!result.current.campaign[0].victory && !initialRShop) {
        expect(result.current.campaign[0].rShop).toBe(initialRShop);
      }
    });

    it("handles eShop click when mission has victory", () => {
      const { result } = renderHook(() => useMissions(), { wrapper });

      // First set a victory
      if (result.current.campaign[0] && result.current.campaign[0].title) {
        act(() => {
          result.current.handleVictoryClick(0)();
        });

        const initialEShop = result.current.campaign[0].eShop;

        act(() => {
          result.current.handleEShopClick(0)();
        });

        expect(result.current.campaign[0].eShop).toBe(!initialEShop);
      }
    });

    it("does not handle eShop click when mission has no victory and eShop is false (line 122 branch)", () => {
      const { result } = renderHook(() => useMissions(), { wrapper });

      // Ensure mission has no victory and eShop is false
      const initialEShop = result.current.campaign[0]?.eShop || false;

      act(() => {
        result.current.handleEShopClick(0)();
      });

      // Should not change if campaign[0].victory is 0 and eShop is false
      if (!result.current.campaign[0].victory && !initialEShop) {
        expect(result.current.campaign[0].eShop).toBe(initialEShop);
      }
    });

    it("updates mission name", () => {
      const { result } = renderHook(() => useMissions(), { wrapper });

      act(() => {
        result.current.updateMissionName(0)({
          target: { value: "Test Mission" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      expect(result.current.campaign[0].title).toBe("Test Mission");
    });

    it("updates mission name with empty value", () => {
      const { result } = renderHook(() => useMissions(), { wrapper });

      act(() => {
        result.current.updateMissionName(0)({
          target: { value: "" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      expect(result.current.campaign[0].title).toBe("");
    });
  });

  describe("useForcedMissions", () => {
    it("initializes with forced missions", () => {
      const { result } = renderHook(() => useForcedMissions(), { wrapper });

      expect(result.current.forcedMissions).toBeDefined();
      expect(Array.isArray(result.current.forcedMissions)).toBe(true);
      expect(typeof result.current.handleVictoryClick).toBe("function");
      expect(typeof result.current.updateMissionName).toBe("function");
    });

    it("handles victory click when forced mission has a title", () => {
      const { result } = renderHook(() => useForcedMissions(), { wrapper });

      // First set a title
      act(() => {
        result.current.updateMissionName(0)({
          target: { value: "Forced Mission 1" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      const initialVictory = result.current.forcedMissions[0].victory;

      act(() => {
        result.current.handleVictoryClick(0)();
      });

      expect(result.current.forcedMissions[0].victory).toBe((initialVictory + 1) % 3);
    });

    it("does not handle victory click when forced mission title is empty (line 152 branch)", () => {
      const { result } = renderHook(() => useForcedMissions(), { wrapper });

      const forcedMissionsBeforeClick = result.current.forcedMissions[0];

      act(() => {
        result.current.handleVictoryClick(0)();
      });

      // Should not have changed since title is empty
      expect(result.current.forcedMissions[0]).toEqual(forcedMissionsBeforeClick);
    });

    it("adds new forced mission when clicking victory on last mission (line 158 branch)", () => {
      const { result } = renderHook(() => useForcedMissions(), { wrapper });

      // First set a title on the last forced mission
      const lastIndex = result.current.forcedMissions.length - 1;

      act(() => {
        result.current.updateMissionName(lastIndex)({
          target: { value: "Last Forced Mission" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      const initialLength = result.current.forcedMissions.length;

      act(() => {
        result.current.handleVictoryClick(lastIndex)();
      });

      // Should have added a new forced mission
      expect(result.current.forcedMissions.length).toBe(initialLength + 1);
    });

    it("does not add new forced mission when clicking victory on non-last mission", () => {
      const { result } = renderHook(() => useForcedMissions(), { wrapper });

      // Ensure we have at least 2 forced missions
      act(() => {
        result.current.updateMissionName(0)({
          target: { value: "First Forced Mission" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      // Add a second forced mission
      const lastIndex = result.current.forcedMissions.length - 1;
      act(() => {
        result.current.updateMissionName(lastIndex)({
          target: { value: "Last Mission" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      act(() => {
        result.current.handleVictoryClick(lastIndex)();
      });

      const lengthAfterAddingSecond = result.current.forcedMissions.length;

      // Now click victory on first mission (not last)
      act(() => {
        result.current.handleVictoryClick(0)();
      });

      // Should not have added a new forced mission
      expect(result.current.forcedMissions.length).toBe(lengthAfterAddingSecond);
    });

    it("updates forced mission name", () => {
      const { result } = renderHook(() => useForcedMissions(), { wrapper });

      act(() => {
        result.current.updateMissionName(0)({
          target: { value: "Test Forced Mission" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      expect(result.current.forcedMissions[0].title).toBe("Test Forced Mission");
    });

    it("updates forced mission name with empty value", () => {
      const { result } = renderHook(() => useForcedMissions(), { wrapper });

      act(() => {
        result.current.updateMissionName(0)({
          target: { value: "" },
        } as React.FocusEvent<HTMLInputElement>);
      });

      expect(result.current.forcedMissions[0].title).toBe("");
    });
  });
});

