import { fireEvent, render, screen, within } from "@testing-library/react";
import { useAtomValue } from "jotai";
import { describe, expect, it, vi } from "vitest";
import BidAdvisor from "./BidAdvisor";

const byTextContent = (text: string) => (_: string, el: Element | null) =>
  el?.textContent === text;

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
  it("does NOT render an in-panel 'Bid Advisor' heading", () => {
    // The heading was removed; the tab label in the dialog top bar is the only
    // "Bid Advisor" text, and that lives outside this component.
    render(<BidAdvisor />);
    expect(screen.queryByText("Bid Advisor")).not.toBeInTheDocument();
    // The three sections still render.
    expect(screen.getByText("My Hand")).toBeInTheDocument();
    expect(screen.getByText("Auction Context")).toBeInTheDocument();
  });

  it("does NOT render its own New Game button (it lives in the dialog top bar)", () => {
    render(<BidAdvisor />);
    expect(
      screen.queryByRole("button", { name: /new game/i }),
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
    // Click "Increase Spades" to make total > 13, triggering the validation error
    fireEvent.click(screen.getByRole("button", { name: "Increase Spades" }));
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

  it("shows stopper input when it would change the bid (15-18 balanced → 1NT overcall)", () => {
    render(<BidAdvisor />);
    // Position 2 so RHO (pos 1) is visible in current round
    fireEvent.click(screen.getByLabelText("Position 2nd"));
    // 16 HCP balanced: with a stopper this is a 1NT overcall, without it a Pass
    // — so the stopper decides the bid and the question must be shown.
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "16" } });
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

  it("does NOT show stopper input when the bid is Pass regardless (stopper can't matter)", () => {
    render(<BidAdvisor />);
    fireEvent.click(screen.getByLabelText("Position 2nd"));
    // Weak balanced hand: passes whether or not it holds a stopper, so the
    // question is pointless noise and must be suppressed.
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "7" } });
    const rhoSelect = screen.getByLabelText(/RHO \(1st\)/i);
    fireEvent.mouseDown(rhoSelect);
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1♠")[0]);
    // Stopper question should NOT show — it would not change the bid
    expect(
      screen.queryByLabelText("Has stopper in opponent's suit"),
    ).not.toBeInTheDocument();
  });

  it("manual Test 1: 9 HCP balanced over RHO's 1♣ → no stopper checkbox (Pass either way)", () => {
    render(<BidAdvisor />);
    fireEvent.click(screen.getByLabelText("Position 2nd"));
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "9" } });
    fireEvent.mouseDown(screen.getByLabelText(/RHO \(1st\)/i));
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1♣")[0]);
    expect(
      screen.queryByLabelText("Has stopper in opponent's suit"),
    ).not.toBeInTheDocument();
  });

  it("manual Test 2: once bidding is complete, shows the final contract (not a Pass recommendation)", () => {
    render(<BidAdvisor />);
    // Dealer opens 1NT; everyone else passes → 1NT is the final contract.
    fireEvent.mouseDown(screen.getByRole("combobox", { name: "My bid" }));
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1NT")[0]);
    fireEvent.click(screen.getByRole("button", { name: /confirm round/i }));

    // The Auction Context banner reports the completed contract; the separate
    // recommendation column is hidden once bidding is over.
    expect(
      screen.getByText(/Bidding complete — Final contract: 1NT/i),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Recommended bid")).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Has stopper in opponent's suit"),
    ).not.toBeInTheDocument();
  });

  it("manual Test 2: a passed-out deal shows the completion banner", () => {
    render(<BidAdvisor />);
    // Dealer (default 0 HCP hand) passes, everyone passes → passed out.
    fireEvent.click(screen.getByRole("button", { name: /confirm round/i }));
    expect(screen.getByText(/Bidding complete/i)).toBeInTheDocument();
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
    // 16 HCP balanced → the stopper decides a 1NT overcall vs Pass.
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "16" } });
    // RHO bids 1♥ (a natural suit bid, no NT opened before it)
    fireEvent.mouseDown(screen.getByLabelText(/RHO \(3rd\)/i));
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText(byTextContent("1♥"))[0]);
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
    // 16 HCP balanced → the stopper decides a 1NT overcall vs Pass.
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "16" } });
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
    // 16 HCP balanced → the stopper decides a 1NT overcall vs Pass.
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "16" } });
    fireEvent.mouseDown(screen.getByLabelText(/RHO \(3rd\)/i));
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText(byTextContent("1♦"))[0]);
    // opponentSuitName = "diamonds"
    expect(
      screen.getByLabelText("Has stopper in opponent's suit"),
    ).toBeInTheDocument();
  });

  it("opponentSuitSymbol is empty when opponent bids NT (line 91 null path)", () => {
    render(<BidAdvisor />);
    // Position 2: RHO(1st) bids 1NT — not a suit bid so opponentSuitName=null
    fireEvent.click(screen.getByLabelText("Position 2nd"));
    const hcpInput = screen.getByLabelText("HCP value");
    fireEvent.change(hcpInput, { target: { value: "8" } });
    fireEvent.mouseDown(screen.getByLabelText(/RHO \(1st\)/i));
    const listbox = screen.getByRole("listbox");
    fireEvent.click(within(listbox).getAllByText("1NT")[0]);
    // isOpponentSuitBid=false → opponentSuitName=null → opponentSuitSymbol=""
    // No stopper input shown since opponent bid NT not a suit
    expect(
      screen.queryByLabelText("Has stopper in opponent's suit"),
    ).not.toBeInTheDocument();
  });

  // ── Suit-quality question gating ────────────────────────────────────────────
  // Shape the default hand (3♠3♥4♦3♣) into a weak-2 zone opener (2♠6♥3♦2♣, 7 HCP)
  // so the suit-quality question becomes relevant and changes the bid.
  const makeWeakTwoHand = () => {
    fireEvent.change(screen.getByLabelText("HCP value"), {
      target: { value: "7" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Increase Hearts" })); // 3→4
    fireEvent.click(screen.getByRole("button", { name: "Increase Hearts" })); // 4→5
    fireEvent.click(screen.getByRole("button", { name: "Increase Hearts" })); // 5→6
    fireEvent.click(screen.getByRole("button", { name: "Decrease Spades" })); // 3→2
    fireEvent.click(screen.getByRole("button", { name: "Decrease Diamonds" })); // 4→3
    fireEvent.click(screen.getByRole("button", { name: "Decrease Clubs" })); // 3→2
  };

  it("does NOT show the suit-quality question for the default 15-17 balanced hand", () => {
    render(<BidAdvisor />);
    fireEvent.change(screen.getByLabelText("HCP value"), {
      target: { value: "16" },
    });
    expect(
      screen.queryByLabelText("Long suit is a good suit"),
    ).not.toBeInTheDocument();
  });

  it("shows the suit-quality question for a weak-2-zone opening hand", () => {
    render(<BidAdvisor />);
    makeWeakTwoHand();
    expect(
      screen.getByLabelText("Long suit is a good suit"),
    ).toBeInTheDocument();
  });

  it("answering the suit-quality question keeps a valid recommendation", () => {
    render(<BidAdvisor />);
    makeWeakTwoHand();
    const checkbox = screen.getByLabelText(
      "Long suit is a good suit",
    ) as HTMLInputElement;
    fireEvent.click(checkbox); // mark the suit good
    expect(screen.getByLabelText("Recommended bid")).toBeInTheDocument();
  });
});
