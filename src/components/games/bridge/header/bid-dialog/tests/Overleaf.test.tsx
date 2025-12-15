import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Overleaf from "../Overleaf";

// Wrap in table for valid HTML structure
const renderInTable = (component: React.ReactNode) => {
  return render(<table>{component}</table>);
};

describe("games | bridge | Overleaf", () => {
  it("renders No Fear Bridge cheat sheet header", () => {
    renderInTable(<Overleaf />);

    expect(
      screen.getByRole("heading", { name: /no fear bridge cheat sheet/i }),
    ).toBeInTheDocument();
    // The subtitle contains the full text
    expect(
      screen.getByText(/american style 5 card majors/i),
    ).toBeInTheDocument();
  });

  it("renders link to nofearbridge.com", () => {
    renderInTable(<Overleaf />);

    const link = screen.getByRole("link", { name: /nofearbridge\.com/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://www.nofearbridge.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders Stayman convention section", () => {
    renderInTable(<Overleaf />);

    expect(
      screen.getByRole("heading", { name: /stayman.*nt response/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/bid 2♣️ to check for major suit fit/i),
    ).toBeInTheDocument();
  });

  it("renders Stayman responses", () => {
    renderInTable(<Overleaf />);

    expect(screen.getByText(/= no 4 card major/i)).toBeInTheDocument();
    expect(screen.getByText(/= 4 ❤️s/i)).toBeInTheDocument();
    expect(screen.getByText(/= 4 ♠️s/i)).toBeInTheDocument();
  });

  it("renders red suit transfers section", () => {
    renderInTable(<Overleaf />);

    expect(
      screen.getByRole("heading", { name: /red suit transfers/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/bid ♦️ for ❤️, bid ❤️ for ♠️/i),
    ).toBeInTheDocument();
  });

  it("renders transfer guidance details", () => {
    renderInTable(<Overleaf />);

    expect(
      screen.getByText(/nt bidder must bid next suit/i),
    ).toBeInTheDocument();
    // Use getAllByText since PASS text appears multiple times
    const passTexts = screen.getAllByText(/pass/i);
    expect(passTexts.length).toBeGreaterThanOrEqual(1);
  });

  it("renders transferring to minor suits guidance", () => {
    renderInTable(<Overleaf />);

    expect(screen.getByText(/transferring to ♣️s or ♦️s/i)).toBeInTheDocument();
    expect(
      screen.getByText(/with a weak hand & a 6\+ card minor suit bid 2♠️/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/1nt bidder must bid 3♣️/i)).toBeInTheDocument();
  });

  it("renders Gerber convention section", () => {
    renderInTable(<Overleaf />);

    expect(
      screen.getByRole("heading", { name: /^gerber$/i }),
    ).toBeInTheDocument();
    // 4♣️ appears multiple times, use getAllByText
    const fourClubTexts = screen.getAllByText(/4♣️/);
    expect(fourClubTexts.length).toBeGreaterThanOrEqual(1);

    // Check for the Gerber aces response
    expect(
      screen.getByText(/4♦️=0 or 4, 4❤️=1, 4♠️=2, 4nt=3/i),
    ).toBeInTheDocument();
  });

  it("renders Gerber kings response", () => {
    renderInTable(<Overleaf />);

    // 5♣️ appears multiple times, use getAllByText
    const fiveClubTexts = screen.getAllByText(/5♣️/);
    expect(fiveClubTexts.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText(/5♦️=0 or 4, 5❤️=1, 5♠️=2, 5nt=3/i),
    ).toBeInTheDocument();
  });

  it("renders Blackwood convention section", () => {
    renderInTable(<Overleaf />);

    expect(
      screen.getByRole("heading", { name: /blackwood.*4nt/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/5♣️=0 or 4, 5♦️=1, 5❤️=2, 5♠️=3/i),
    ).toBeInTheDocument();
  });

  it("renders Blackwood kings response", () => {
    renderInTable(<Overleaf />);

    expect(
      screen.getByText(/6♣️=0 or 4, 6♦️=1, 6❤️=2, 6♠️=3/i),
    ).toBeInTheDocument();
  });

  it("renders do not ask for Kings warning", () => {
    renderInTable(<Overleaf />);

    expect(
      screen.getByText(/do not ask for kings unless you know/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/you have the strength for a grand slam/i),
    ).toBeInTheDocument();
  });

  it("renders Hand Valuation section", () => {
    renderInTable(<Overleaf />);

    expect(
      screen.getByRole("heading", { name: /hand valuation/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("HCP")).toBeInTheDocument();
    expect(
      screen.getByText(/high card points: ace=4, king=3, queen=2, jack=1/i),
    ).toBeInTheDocument();
  });

  it("renders Long and Short suit points guidance", () => {
    renderInTable(<Overleaf />);

    expect(
      screen.getByText(/long suit points: 1 for every card more than 4/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/short suit points:.*with trump fit only/i),
    ).toBeInTheDocument();
  });

  it("renders Total Points guidance", () => {
    renderInTable(<Overleaf />);

    // TP appears multiple times (header row)
    const tpTexts = screen.getAllByText("TP");
    expect(tpTexts.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("Total Points")).toBeInTheDocument();
    expect(screen.getByText(/hcp \+ long suit points/i)).toBeInTheDocument();
    expect(screen.getByText(/hcp \+ short suit points/i)).toBeInTheDocument();
  });

  it("renders Contract Limit Guide section", () => {
    renderInTable(<Overleaf />);

    expect(
      screen.getByRole("heading", { name: /contract limit guide/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("19-24")).toBeInTheDocument();
    expect(screen.getByText("Non-Game Bids")).toBeInTheDocument();
    expect(screen.getByText("25+")).toBeInTheDocument();
    expect(screen.getByText(/3nt or 4❤️♠️/i)).toBeInTheDocument();
  });

  it("renders slam guidance in Contract Limit Guide", () => {
    renderInTable(<Overleaf />);

    expect(screen.getByText("31+")).toBeInTheDocument();
    expect(screen.getByText(/& 6 in suit\? small slam/i)).toBeInTheDocument();
    expect(screen.getByText("33+")).toBeInTheDocument();
    expect(screen.getByText("6NT")).toBeInTheDocument();
    expect(screen.getByText("35+")).toBeInTheDocument();
    expect(screen.getByText(/& 7 in suit\? grand slam/i)).toBeInTheDocument();
    expect(screen.getByText("37+")).toBeInTheDocument();
    expect(screen.getByText("7NT")).toBeInTheDocument();
  });

  it("has proper displayName", () => {
    expect(Overleaf.displayName).toBe("Overleaf");
  });
});
