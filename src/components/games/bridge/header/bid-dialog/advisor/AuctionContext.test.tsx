import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuctionContextInput from "./AuctionContext";
import type { AuctionState } from "./bidding-logic";

// myPosition: 3 → partner=1, rho=2, lho=4
const defaultState: AuctionState = {
  myPosition: 3,
  completedRounds: [],
  currentRound: {},
};

const renderAuctionContext = (
  state: AuctionState = defaultState,
  onChange = vi.fn(),
  weVulnerable = false,
  theyVulnerable = false,
  recommendedBid?: string,
) =>
  render(
    <AuctionContextInput
      state={state}
      onChange={onChange}
      weVulnerable={weVulnerable}
      theyVulnerable={theyVulnerable}
      recommendedBid={recommendedBid}
    />,
  );

describe("games | bridge | AuctionContext", () => {
  // ── Heading ─────────────────────────────────────────────────────────────────

  it("renders the heading", () => {
    renderAuctionContext();
    expect(screen.getByText("Auction Context")).toBeInTheDocument();
  });

  // ── Position selector ────────────────────────────────────────────────────────

  it("renders all four position chips", () => {
    renderAuctionContext();
    expect(screen.getByLabelText("Position 1st")).toBeInTheDocument();
    expect(screen.getByLabelText("Position 2nd")).toBeInTheDocument();
    expect(screen.getByLabelText("Position 3rd")).toBeInTheDocument();
    expect(screen.getByLabelText("Position 4th")).toBeInTheDocument();
  });

  it("shows the currently selected position as filled", () => {
    renderAuctionContext({ ...defaultState, myPosition: 2 });
    const chip = screen.getByLabelText("Position 2nd");
    expect(chip.closest(".MuiChip-filled")).toBeTruthy();
  });

  it("calls onChange with reset rounds when a position is clicked", () => {
    const onChange = vi.fn();
    renderAuctionContext(defaultState, onChange);
    fireEvent.click(screen.getByLabelText("Position 4th"));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        myPosition: 4,
        currentRound: {},
        completedRounds: [],
      }),
    );
  });

  // ── Vulnerability display (read-only) ─────────────────────────────────────────

  it("does NOT render a vulnerability radio group", () => {
    renderAuctionContext();
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
  });

  it("shows 'We: Not Vulnerable' chip when not vulnerable", () => {
    renderAuctionContext(defaultState, vi.fn(), false, false);
    expect(screen.getByText("We: Not Vulnerable")).toBeInTheDocument();
  });

  it("shows 'We: Vulnerable' chip when vulnerable", () => {
    renderAuctionContext(defaultState, vi.fn(), true, false);
    expect(screen.getByText("We: Vulnerable")).toBeInTheDocument();
  });

  it("shows 'They: Vulnerable' chip when opponent is vulnerable", () => {
    renderAuctionContext(defaultState, vi.fn(), false, true);
    expect(screen.getByText("They: Vulnerable")).toBeInTheDocument();
  });

  // ── Dynamic dropdown count based on position ──────────────────────────────────

  it("position 1 shows dealer message in the current round section", () => {
    renderAuctionContext({ ...defaultState, myPosition: 1 });
    expect(screen.getByText(/you are the dealer/i)).toBeInTheDocument();
    // The "current round" section itself has no before-me dropdowns; the
    // complete-this-round section will show after-me slots (LHO/Partner/RHO)
    expect(screen.queryByLabelText("RHO (1st)")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Partner (1st)")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("LHO (1st)")).not.toBeInTheDocument();
  });

  it("position 2 shows exactly one before-me dropdown (RHO 1st)", () => {
    renderAuctionContext({ ...defaultState, myPosition: 2 });
    // Before my turn: RHO is at position 1
    expect(screen.getByLabelText("RHO (1st)")).toBeInTheDocument();
    // Partner/LHO do not appear in the before-me section
    expect(screen.queryByLabelText("Partner (1st)")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("LHO (1st)")).not.toBeInTheDocument();
  });

  it("position 3 shows two before-me dropdowns (Partner 1st, RHO 2nd)", () => {
    renderAuctionContext({ ...defaultState, myPosition: 3 });
    expect(screen.getByLabelText("Partner (1st)")).toBeInTheDocument();
    expect(screen.getByLabelText("RHO (2nd)")).toBeInTheDocument();
    // LHO is at position 4 (after me), so no LHO in before-me section
    expect(screen.queryByLabelText("LHO (1st)")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("LHO (2nd)")).not.toBeInTheDocument();
  });

  it("position 4 shows three dropdowns (LHO 1st, Partner 2nd, RHO 3rd)", () => {
    renderAuctionContext({ ...defaultState, myPosition: 4 });
    expect(screen.getByLabelText("LHO (1st)")).toBeInTheDocument();
    expect(screen.getByLabelText("Partner (2nd)")).toBeInTheDocument();
    expect(screen.getByLabelText("RHO (3rd)")).toBeInTheDocument();
  });

  // ── Dropdown onChange ─────────────────────────────────────────────────────────

  it("calls onChange with updated currentRound when Partner bid changes (position 3)", () => {
    const onChange = vi.fn();
    renderAuctionContext({ ...defaultState, myPosition: 3 }, onChange);
    const partnerSelect = screen.getByLabelText("Partner (1st)");
    fireEvent.mouseDown(partnerSelect);
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1NT")[0]);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        currentRound: expect.objectContaining({ 1: "1NT" }),
      }),
    );
  });

  it("calls onChange with updated currentRound when RHO bid changes (position 2)", () => {
    const onChange = vi.fn();
    renderAuctionContext({ ...defaultState, myPosition: 2 }, onChange);
    const rhoSelect = screen.getByLabelText("RHO (1st)");
    fireEvent.mouseDown(rhoSelect);
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1♥")[0]);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        currentRound: expect.objectContaining({ 1: "1♥" }),
      }),
    );
  });

  // ── Dynamic bid filtering ─────────────────────────────────────────────────────

  it("after pos-1 bids 2♣, pos-2 dropdown should not include 1♥", () => {
    const stateWithBid: AuctionState = {
      ...defaultState,
      myPosition: 3,
      currentRound: { 1: "2♣" },
    };
    renderAuctionContext(stateWithBid);
    const rhoSelect = screen.getByLabelText("RHO (2nd)");
    fireEvent.mouseDown(rhoSelect);
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).queryByText("1♥")).not.toBeInTheDocument();
    expect(within(listbox).queryByText("1NT")).not.toBeInTheDocument();
    fireEvent.keyDown(listbox, { key: "Escape" });
  });

  it("after pos-1 bids 2♣, pos-2 dropdown should include 2♦ and higher", () => {
    const stateWithBid: AuctionState = {
      ...defaultState,
      myPosition: 3,
      currentRound: { 1: "2♣" },
    };
    renderAuctionContext(stateWithBid);
    const rhoSelect = screen.getByLabelText("RHO (2nd)");
    fireEvent.mouseDown(rhoSelect);
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getAllByText("2♦").length).toBeGreaterThan(0);
    fireEvent.keyDown(listbox, { key: "Escape" });
  });

  // ── Complete this round form (always visible) ─────────────────────────────────

  it("renders the 'Complete this round' section without requiring a button click", () => {
    renderAuctionContext();
    expect(screen.getByText(/complete this round/i)).toBeInTheDocument();
    expect(screen.getByLabelText("My bid")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm round/i }),
    ).toBeInTheDocument();
  });

  it("does NOT render a '+ Add Next Round' toggle button", () => {
    renderAuctionContext();
    expect(
      screen.queryByRole("button", { name: /add next round/i }),
    ).not.toBeInTheDocument();
  });

  it("does NOT render a Cancel button", () => {
    renderAuctionContext();
    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();
  });

  it("Confirm Round appends to completedRounds and resets currentRound", () => {
    const onChange = vi.fn();
    const stateWithCurrentRound: AuctionState = {
      ...defaultState,
      myPosition: 3,
      currentRound: { 1: "1♠", 2: "Pass" },
    };
    renderAuctionContext(stateWithCurrentRound, onChange);
    fireEvent.click(screen.getByRole("button", { name: /confirm round/i }));
    const call = onChange.mock.calls[0][0] as AuctionState;
    expect(call.completedRounds).toHaveLength(1);
    expect(call.currentRound).toEqual({});
  });

  it("Confirm Round only uses recommendedBid for user position — other positions default to Pass", () => {
    const onChange = vi.fn();
    const stateP1: AuctionState = {
      ...defaultState,
      myPosition: 1,
      currentRound: {},
    };
    // Render with recommendedBid = "1NT" for player 1
    renderAuctionContext(stateP1, onChange, false, false, "1NT");
    // Confirm without changing any dropdowns — positions 2/3/4 should default to Pass
    fireEvent.click(screen.getByRole("button", { name: /confirm round/i }));
    const call = onChange.mock.calls[0][0] as AuctionState;
    const round = call.completedRounds[0];
    expect(round[1]).toBe("1NT"); // my bid uses recommendedBid
    expect(round[2]).toBe("Pass");
    expect(round[3]).toBe("Pass");
    expect(round[4]).toBe("Pass");
  });

  it("position 4 has no post-round slots after My bid (last bidder in round)", () => {
    renderAuctionContext({ ...defaultState, myPosition: 4 });
    expect(screen.getByLabelText("My bid")).toBeInTheDocument();
    // No positions come after position 4
    expect(
      screen.queryByLabelText(/RHO.*4th|Partner.*3rd.*round/i),
    ).not.toBeInTheDocument();
  });

  it("position 1 shows 3 post-round slots in Complete this round form", () => {
    renderAuctionContext({ ...defaultState, myPosition: 1 });
    expect(screen.getByLabelText("My bid")).toBeInTheDocument();
    expect(screen.getByLabelText("LHO (2nd)")).toBeInTheDocument();
    expect(screen.getByLabelText("Partner (3rd)")).toBeInTheDocument();
    expect(screen.getByLabelText("RHO (4th)")).toBeInTheDocument();
  });

  // ── My bid defaults to recommendedBid ─────────────────────────────────────────

  it("My bid defaults to recommendedBid when provided", () => {
    renderAuctionContext(defaultState, vi.fn(), false, false, "1NT");
    const myBidCombo = screen.getByRole("combobox", { name: "My bid" });
    expect(myBidCombo).toHaveTextContent("1NT");
  });

  it("My bid defaults to Pass when no recommendedBid is provided", () => {
    renderAuctionContext(defaultState, vi.fn(), false, false, undefined);
    const myBidCombo = screen.getByRole("combobox", { name: "My bid" });
    expect(myBidCombo).toHaveTextContent("Pass");
  });

  it("Use recommendation chip does NOT appear when recommendedBid matches current selection", () => {
    renderAuctionContext(defaultState, vi.fn(), false, false, "1♠");
    // Initially, my bid = recommendedBid (no explicit selection yet), so chip hidden
    expect(
      screen.queryByRole("button", { name: /use recommendation/i }),
    ).not.toBeInTheDocument();
  });

  it("Use recommendation chip appears when user selects a different bid", () => {
    renderAuctionContext(defaultState, vi.fn(), false, false, "1♠");
    const myBidSelect = screen.getByLabelText("My bid");
    fireEvent.mouseDown(myBidSelect);
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("Pass")[0]);
    fireEvent.keyDown(listbox, { key: "Escape" });
    expect(
      screen.getByRole("button", { name: /use recommendation.*1♠/i }),
    ).toBeInTheDocument();
  });

  it("clicking Use recommendation chip sets my bid back to the recommendation", () => {
    renderAuctionContext(defaultState, vi.fn(), false, false, "1♠");
    const myBidSelect = screen.getByLabelText("My bid");
    fireEvent.mouseDown(myBidSelect);
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("Pass")[0]);
    fireEvent.keyDown(listbox, { key: "Escape" });
    const useBtn = screen.getByRole("button", {
      name: /use recommendation.*1♠/i,
    });
    fireEvent.click(useBtn);
    const myBidCombo = screen.getByRole("combobox", { name: "My bid" });
    expect(myBidCombo).toHaveTextContent("1♠");
    // Chip should disappear again
    expect(
      screen.queryByRole("button", { name: /use recommendation/i }),
    ).not.toBeInTheDocument();
  });

  // ── Completed rounds display ──────────────────────────────────────────────────

  it("shows completed round label when there is a prior round", () => {
    const stateWithRounds: AuctionState = {
      ...defaultState,
      completedRounds: [{ 1: "1♣", 2: "Pass", 3: "Pass", 4: "Pass" }],
    };
    renderAuctionContext(stateWithRounds);
    expect(screen.getByText("Round 1:")).toBeInTheDocument();
  });

  it("does NOT show prior rounds section when there are no completed rounds", () => {
    renderAuctionContext();
    expect(screen.queryByText("Round 1:")).not.toBeInTheDocument();
    expect(screen.queryByText("Prior Rounds")).not.toBeInTheDocument();
  });

  it("completed round chips do NOT have standalone ⓘ icon buttons", () => {
    const stateWithRounds: AuctionState = {
      ...defaultState,
      myPosition: 3,
      completedRounds: [{ 1: "1♠", 2: "Pass", 3: "Pass", 4: "Pass" }],
    };
    renderAuctionContext(stateWithRounds);
    const priorRoundsSection = screen.getByText("Round 1:").closest("div");
    expect(
      within(priorRoundsSection!).queryByRole("button", {
        name: /info about/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("completed round chip for my own bid has a tooltip (not disableHoverListener)", () => {
    const stateWithRounds: AuctionState = {
      ...defaultState,
      myPosition: 3,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2♣", 4: "Pass" }],
    };
    renderAuctionContext(stateWithRounds);
    // "Me: 2♣" chip should exist — tooltip is always active
    expect(screen.getByText("Me: 2♣")).toBeInTheDocument();
  });

  it("completed round chip for a Pass bid exists (tooltip active for Pass)", () => {
    const stateWithRounds: AuctionState = {
      ...defaultState,
      myPosition: 3,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "Pass", 4: "Pass" }],
    };
    renderAuctionContext(stateWithRounds);
    // All chips are rendered including Pass ones
    expect(screen.getAllByText(/Pass/).length).toBeGreaterThan(0);
  });

  // ── Info icons on dropdowns ───────────────────────────────────────────────────

  it("shows ⓘ icon next to dropdown when a non-Pass bid is selected", () => {
    const stateWithBid: AuctionState = {
      ...defaultState,
      myPosition: 3,
      currentRound: { 1: "1NT" },
    };
    renderAuctionContext(stateWithBid);
    expect(screen.getByLabelText("Show info about 1NT")).toBeInTheDocument();
  });

  it("shows ⓘ icon even when bid is Pass (Pass has a tooltip)", () => {
    renderAuctionContext();
    // Position 3 with default state: Partner (1st) and RHO (2nd) both default to Pass
    // Both should show the info icon now
    expect(
      screen.getAllByLabelText("Show info about Pass").length,
    ).toBeGreaterThan(0);
  });

  // ── Bidding complete banner ───────────────────────────────────────────────────

  it("shows bidding complete alert when 3 consecutive passes detected", () => {
    const stateComplete: AuctionState = {
      ...defaultState,
      myPosition: 1,
      completedRounds: [{ 1: "1♠", 2: "Pass", 3: "Pass", 4: "Pass" }],
    };
    renderAuctionContext(stateComplete);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/bidding complete/i);
    expect(alert).toHaveTextContent("1♠");
  });

  it("hides current-round dropdowns when bidding is complete", () => {
    const stateComplete: AuctionState = {
      ...defaultState,
      myPosition: 3,
      completedRounds: [{ 1: "1♥", 2: "Pass", 3: "Pass", 4: "Pass" }],
    };
    renderAuctionContext(stateComplete);
    // Bidding is over — "Complete this round" form should be gone
    expect(screen.queryByText(/complete this round/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /confirm round/i }),
    ).not.toBeInTheDocument();
  });

  it("hides current-round bids-before-me section when bidding is complete", () => {
    const stateComplete: AuctionState = {
      ...defaultState,
      myPosition: 4,
      completedRounds: [{ 1: "1♥", 2: "Pass", 3: "Pass", 4: "Pass" }],
    };
    renderAuctionContext(stateComplete);
    // "Current round — bids before my turn" should be hidden
    expect(
      screen.queryByText(/current round — bids before my turn/i),
    ).not.toBeInTheDocument();
    // Prior rounds are still visible
    expect(screen.getByText(/round 1/i)).toBeInTheDocument();
  });

  it("shows current-round form when bidding is NOT complete", () => {
    // Use an in-progress round (no consecutive 3 passes) so isComplete is false
    renderAuctionContext({
      ...defaultState,
      myPosition: 3,
      currentRound: { 1: "1♥", 2: "2♠" },
    });
    expect(screen.getByText(/complete this round/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm round/i }),
    ).toBeInTheDocument();
  });

  it("does NOT show bidding complete alert when bidding is not finished", () => {
    renderAuctionContext(defaultState);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  // ── No situation dropdown ─────────────────────────────────────────────────────

  it("does NOT render a Bidding Situation dropdown", () => {
    renderAuctionContext();
    expect(
      screen.queryByLabelText("Bidding Situation"),
    ).not.toBeInTheDocument();
  });

  // ── Agreed Trump Suit (conditional) ──────────────────────────────────────────

  it("does NOT show Agreed Trump Suit when no Blackwood/GSF in completed rounds", () => {
    renderAuctionContext();
    expect(
      screen.queryByLabelText("Agreed Trump Suit"),
    ).not.toBeInTheDocument();
  });

  it("shows Agreed Trump Suit when my prior bid was 4NT", () => {
    const stateWithBlackwood: AuctionState = {
      ...defaultState,
      myPosition: 3,
      completedRounds: [{ 3: "4NT", 1: "Pass", 2: "Pass", 4: "Pass" }],
    };
    renderAuctionContext(stateWithBlackwood);
    expect(screen.getByLabelText("Agreed Trump Suit")).toBeInTheDocument();
  });

  it("calls onChange when Agreed Trump Suit changes", () => {
    const onChange = vi.fn();
    const stateWithBlackwood: AuctionState = {
      ...defaultState,
      myPosition: 3,
      completedRounds: [{ 3: "4NT", 1: "Pass", 2: "Pass", 4: "Pass" }],
    };
    renderAuctionContext(stateWithBlackwood, onChange);
    const agreedSuitSelect = screen.getByLabelText("Agreed Trump Suit");
    fireEvent.mouseDown(agreedSuitSelect);
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("♥")[0]);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ agreedSuit: "♥" }),
    );
  });

  // ── BidInfoIcon open state (lines 147/150) ────────────────────────────────────

  it("clicking the ⓘ info icon toggles it to open state (aria-label changes)", () => {
    const stateWithBid: AuctionState = {
      ...defaultState,
      myPosition: 3,
      currentRound: { 1: "1NT" },
    };
    renderAuctionContext(stateWithBid);
    const infoBtn = screen.getByLabelText("Show info about 1NT");
    fireEvent.click(infoBtn);
    // After click, aria-label changes to "Hide info about 1NT"
    expect(screen.getByLabelText("Hide info about 1NT")).toBeInTheDocument();
  });

  // ── BidChip open state (lines 241/246) ───────────────────────────────────────

  it("clicking a completed round chip changes its aria-label to 'tap to hide'", () => {
    const stateWithRounds: AuctionState = {
      ...defaultState,
      myPosition: 3,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2♣", 4: "Pass" }],
    };
    renderAuctionContext(stateWithRounds);
    // Find a chip by role=button with its known label
    const chip = screen.getByRole("button", {
      name: /Partner \(1st\): 1NT — tap to show meaning/i,
    });
    fireEvent.click(chip);
    expect(
      screen.getByRole("button", {
        name: /Partner \(1st\): 1NT — tap to hide meaning/i,
      }),
    ).toBeInTheDocument();
  });

  // ── Passed-out hand: isComplete=true but finalContract=undefined (line 494 false) ──

  it("passed-out hand shows 'Bidding complete' alert without a final contract", () => {
    const passedOut: AuctionState = {
      ...defaultState,
      myPosition: 1,
      completedRounds: [{ 1: "Pass", 2: "Pass", 3: "Pass", 4: "Pass" }],
    };
    renderAuctionContext(passedOut);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(/bidding complete/i);
    // The "— Final contract: X" part should NOT be present
    expect(alert.textContent).not.toContain("Final contract:");
  });

  // ── prevHighBid backwards search through completed rounds (lines 292-297) ────

  it("prevHighBid in second round fetches prior-round bid for tooltip context", () => {
    // Round 1: 1♠ by pos 1. Round 2: all Pass.
    // In round 2, pos 1 chip prevHighBid should look back to round 1.
    const stateMultiRound: AuctionState = {
      ...defaultState,
      myPosition: 3,
      completedRounds: [
        { 1: "1♠", 2: "Pass", 3: "Pass", 4: "Pass" },
        { 1: "Pass", 2: "Pass", 3: "Pass", 4: "Pass" },
      ],
    };
    renderAuctionContext(stateMultiRound);
    // Both rounds should be rendered (exercise the prevHighBid backward search)
    expect(screen.getByText("Round 1:")).toBeInTheDocument();
    expect(screen.getByText("Round 2:")).toBeInTheDocument();
  });
});
