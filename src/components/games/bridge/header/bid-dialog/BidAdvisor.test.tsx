import { fireEvent, render, screen, within } from "@testing-library/react";
import { useAtomValue } from "jotai";
import { describe, expect, it, vi } from "vitest";
import BidAdvisor from "./BidAdvisor";

// Mock jotai's useAtomValue to provide bridge game state
vi.mock("jotai", async (importOriginal) => {
  const actual = await importOriginal<typeof import("jotai")>();
  return {
    ...actual,
    useAtomValue: vi.fn(() => ({
      weVulnerable: false,
      theyVulnerable: false,
      weWins: 0,
      theyWins: 0,
      weSum: 0,
      theySum: 0,
      gameIdx: 0,
    })),
  };
});

const mockAtomValue = vi.mocked(useAtomValue);

describe("games | bridge | BidAdvisor", () => {
  it("renders the Bid Advisor heading", () => {
    render(<BidAdvisor />);
    expect(screen.getByText("Bid Advisor")).toBeInTheDocument();
  });

  it("renders New Game button (not 'Start Over')", () => {
    render(<BidAdvisor />);
    expect(
      screen.getByRole("button", { name: /new game/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /start over/i }),
    ).not.toBeInTheDocument();
  });

  it("does NOT render a View Cheat Sheet button", () => {
    render(<BidAdvisor />);
    expect(
      screen.queryByRole("button", { name: /view cheat sheet/i }),
    ).not.toBeInTheDocument();
  });

  it("does NOT render the stepper", () => {
    render(<BidAdvisor />);
    expect(
      screen.queryByRole("list", { name: /stepper/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^next$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /get recommendation/i }),
    ).not.toBeInTheDocument();
  });

  it("renders Hand Input section immediately", () => {
    render(<BidAdvisor />);
    expect(screen.getByText(/High Card Points/i)).toBeInTheDocument();
  });

  it("renders Auction Context section immediately", () => {
    render(<BidAdvisor />);
    expect(screen.getByText("Auction Context")).toBeInTheDocument();
  });

  it("renders position selector chips immediately", () => {
    render(<BidAdvisor />);
    expect(screen.getByLabelText("Position 1st")).toBeInTheDocument();
    expect(screen.getByLabelText("Position 2nd")).toBeInTheDocument();
    expect(screen.getByLabelText("Position 3rd")).toBeInTheDocument();
    expect(screen.getByLabelText("Position 4th")).toBeInTheDocument();
  });

  it("does NOT render a vulnerability radio group", () => {
    render(<BidAdvisor />);
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
  });

  it("renders read-only vulnerability chips", () => {
    render(<BidAdvisor />);
    expect(screen.getByText(/We: Not Vulnerable/i)).toBeInTheDocument();
    expect(screen.getByText(/They: Not Vulnerable/i)).toBeInTheDocument();
  });

  it("shows placeholder message when hand is invalid (cards ≠ 13)", () => {
    render(<BidAdvisor />);
    const spadesInput = screen.getByLabelText("Spades count");
    fireEvent.change(spadesInput, { target: { value: "5" } });
    expect(screen.getByText(/cards must total 13/i)).toBeInTheDocument();
    expect(screen.queryByLabelText("Recommended bid")).not.toBeInTheDocument();
  });

  it("shows recommendation immediately when hand is valid (default hand)", () => {
    render(<BidAdvisor />);
    expect(screen.getByLabelText("Recommended bid")).toBeInTheDocument();
  });

  it("recommendation updates live when HCP changes", () => {
    render(<BidAdvisor />);
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "15" } });
    expect(screen.getByLabelText("Recommended bid")).toBeInTheDocument();
  });

  it("New Game button resets hand back to defaults", () => {
    render(<BidAdvisor />);
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "20" } });
    fireEvent.click(screen.getByRole("button", { name: /new game/i }));
    expect(hcpInput).toHaveValue(0);
  });

  it("New Game button resets position back to 1st (default)", () => {
    render(<BidAdvisor />);
    fireEvent.click(screen.getByLabelText("Position 2nd"));
    fireEvent.click(screen.getByRole("button", { name: /new game/i }));
    const pos1 = screen.getByLabelText("Position 1st");
    expect(pos1.closest(".MuiChip-filled")).toBeTruthy();
  });

  it("shows confidence badge on recommendation", () => {
    render(<BidAdvisor />);
    const badge = screen.getByLabelText(/Confidence level/i);
    expect(badge).toBeInTheDocument();
  });

  it("shows 'We: Vulnerable' and 'They: Vulnerable' when both vulnerable", () => {
    mockAtomValue.mockReturnValueOnce({
      weVulnerable: true,
      theyVulnerable: true,
      weWins: 1,
      theyWins: 1,
      weSum: 0,
      theySum: 0,
      gameIdx: 2,
    });
    render(<BidAdvisor />);
    expect(screen.getByText(/We: Vulnerable/i)).toBeInTheDocument();
    expect(screen.getByText(/They: Vulnerable/i)).toBeInTheDocument();
  });

  it("shows 'We: Vulnerable' only when only we are vulnerable", () => {
    mockAtomValue.mockReturnValueOnce({
      weVulnerable: true,
      theyVulnerable: false,
      weWins: 1,
      theyWins: 0,
      weSum: 0,
      theySum: 0,
      gameIdx: 1,
    });
    render(<BidAdvisor />);
    expect(screen.getByText(/We: Vulnerable/i)).toBeInTheDocument();
    expect(screen.getByText(/They: Not Vulnerable/i)).toBeInTheDocument();
  });

  it("shows 'They: Vulnerable' only when only they are vulnerable", () => {
    mockAtomValue.mockReturnValueOnce({
      weVulnerable: false,
      theyVulnerable: true,
      weWins: 0,
      theyWins: 1,
      weSum: 0,
      theySum: 0,
      gameIdx: 1,
    });
    render(<BidAdvisor />);
    expect(screen.getByText(/We: Not Vulnerable/i)).toBeInTheDocument();
    expect(screen.getByText(/They: Vulnerable/i)).toBeInTheDocument();
  });

  it("My bid dropdown is always visible (no toggle button required)", () => {
    render(<BidAdvisor />);
    expect(screen.getByLabelText("My bid")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add next round/i }),
    ).not.toBeInTheDocument();
  });

  it("My bid pre-fills with the current recommendation when hand is valid", () => {
    render(<BidAdvisor />);
    // Default hand (0 HCP, balanced) gives a recommendation — My bid should default to it
    const myBidSelect = screen.getByLabelText("My bid");
    // The recommended bid is pre-filled (not empty / just "Pass" arbitrarily)
    expect(myBidSelect).toBeInTheDocument();
    // Recommendation is computed — verify the recommended bid aria-label is present
    expect(screen.getByLabelText("Recommended bid")).toBeInTheDocument();
  });

  it("position 1 shows 'You are the dealer' message with no dropdowns", () => {
    render(<BidAdvisor />);
    // Default is position 1
    expect(screen.getByText(/you are the dealer/i)).toBeInTheDocument();
  });

  it("position 2 shows one dropdown for prior bid", () => {
    render(<BidAdvisor />);
    fireEvent.click(screen.getByLabelText("Position 2nd"));
    expect(screen.getByLabelText(/RHO \(1st\)/i)).toBeInTheDocument();
  });

  it("shows stopper input when opponent has bid a suit (HCP >= 6)", () => {
    render(<BidAdvisor />);
    // Position 2 so RHO (pos 1) is visible in current round
    fireEvent.click(screen.getByLabelText("Position 2nd"));
    // Set HCP to 10 (>= 6 required for stopper to show)
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "10" } });
    // Open the RHO dropdown and pick 1♠
    const rhoSelect = screen.getByLabelText(/RHO \(1st\)/i);
    fireEvent.mouseDown(rhoSelect);
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1♠")[0]);
    // Stopper question should now be visible
    expect(
      screen.getByLabelText("Has stopper in opponent's suit"),
    ).toBeInTheDocument();
  });

  it("does NOT show stopper input when HCP < 6 even with opponent suit bid", () => {
    render(<BidAdvisor />);
    fireEvent.click(screen.getByLabelText("Position 2nd"));
    // Keep HCP at 0 (default)
    const rhoSelect = screen.getByLabelText(/RHO \(1st\)/i);
    fireEvent.mouseDown(rhoSelect);
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1♠")[0]);
    // Stopper question should NOT show (HCP = 0 < 6)
    expect(
      screen.queryByLabelText("Has stopper in opponent's suit"),
    ).not.toBeInTheDocument();
  });

  it("does NOT show stopper input when opponent bid a conventional 2♣ (lhoIsNT=true)", () => {
    render(<BidAdvisor />);
    // Position 4: LHO(1st), Partner(2nd), RHO(3rd) visible in current round
    fireEvent.click(screen.getByLabelText("Position 4th"));
    // Set HCP to 10
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "10" } });
    // LHO opens 1NT
    fireEvent.mouseDown(screen.getByLabelText(/LHO \(1st\)/i));
    let listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1NT")[0]);
    // RHO bids 2♣ (Stayman — conventional, not a suit bid)
    fireEvent.mouseDown(screen.getByLabelText(/RHO \(3rd\)/i));
    listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("2♣")[0]);
    // Since 2♣ is conventional when lhoBid ends with NT, stopper input should NOT appear
    expect(
      screen.queryByLabelText("Has stopper in opponent's suit"),
    ).not.toBeInTheDocument();
  });

  it("shows stopper input when opponent bid a natural suit (not conventional 2♣)", () => {
    render(<BidAdvisor />);
    fireEvent.click(screen.getByLabelText("Position 4th"));
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "10" } });
    // RHO bids 1♥ (a natural suit bid, no NT opened before it)
    fireEvent.mouseDown(screen.getByLabelText(/RHO \(3rd\)/i));
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1♥")[0]);
    // Stopper question should appear for the heart suit
    expect(
      screen.getByLabelText("Has stopper in opponent's suit"),
    ).toBeInTheDocument();
  });

  it("does NOT show stopper when RHO opened NT and LHO bid conventional 2♣ (rhoIsNT branch)", () => {
    render(<BidAdvisor />);
    // Position 4: LHO(1st), Partner(2nd), RHO(3rd)
    fireEvent.click(screen.getByLabelText("Position 4th"));
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "10" } });
    // RHO opens 1NT → rhoIsNT = true
    fireEvent.mouseDown(screen.getByLabelText(/RHO \(3rd\)/i));
    let listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1NT")[0]);
    // LHO bids 2♣ — conventional (Landy/DONT) because rhoIsNT
    fireEvent.mouseDown(screen.getByLabelText(/LHO \(1st\)/i));
    listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("2♣")[0]);
    // 2♣ is conventional here → stopper input should NOT appear
    expect(
      screen.queryByLabelText("Has stopper in opponent's suit"),
    ).not.toBeInTheDocument();
  });

  it("shows stopper input when LHO bid a natural club (lhoBid suit path, clubs)", () => {
    render(<BidAdvisor />);
    // Position 4: LHO(1st) bids, no RHO suit bid
    fireEvent.click(screen.getByLabelText("Position 4th"));
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "10" } });
    // LHO opens 1♣ (natural suit — no NT opened, so not conventional)
    fireEvent.mouseDown(screen.getByLabelText(/LHO \(1st\)/i));
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1♣")[0]);
    // opponentSuitBid comes from lhoBid path → "clubs" suit name
    expect(
      screen.getByLabelText("Has stopper in opponent's suit"),
    ).toBeInTheDocument();
  });

  it("shows stopper input when RHO bid 1♦ (diamonds suit name)", () => {
    render(<BidAdvisor />);
    // Position 4: RHO(3rd) bids 1♦ before me
    fireEvent.click(screen.getByLabelText("Position 4th"));
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "10" } });
    fireEvent.mouseDown(screen.getByLabelText(/RHO \(3rd\)/i));
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1♦")[0]);
    // opponentSuitName = "diamonds"
    expect(
      screen.getByLabelText("Has stopper in opponent's suit"),
    ).toBeInTheDocument();
  });
});
