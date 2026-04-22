import { render, screen } from "@testing-library/react";
import ScoreTable from "./ScoreTable";
import { ScoreRow } from "../../../jotai/spades-atom";

describe("games | spades | ScoreTable", () => {
  const initials = "ABCD";

  it("renders table headers with initials", () => {
    render(<ScoreTable initials={initials} data={[]} />);
    expect(screen.getByText("ABCD", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("AC")).toBeInTheDocument();
    expect(screen.getByText("BD")).toBeInTheDocument();
  });

  it("renders empty table body when data is empty", () => {
    render(<ScoreTable initials={initials} data={[]} />);
    expect(screen.queryByRole("row", { name: "" })).not.toBeInTheDocument();
  });

  it("renders bid-only row (no score) with 🥇 icon on last row", () => {
    const data: ScoreRow[] = [{ start: "A", bid: "3234" }];
    render(<ScoreTable initials={initials} data={data} />);
    // Header cell has "🥇"; body last-row cell has "A🥇" (start + icon)
    expect(
      screen.getByText(
        (content, el) => el?.tagName === "TD" && content === "A🥇",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("3234")).toBeInTheDocument();
  });

  it("renders scored row with 🃏 icon on last row when score1 exists", () => {
    const data: ScoreRow[] = [
      { start: "A", bid: "3234", score1: 6, bags1: 1, score2: 4, bags2: 0 },
    ];
    render(<ScoreTable initials={initials} data={data} />);
    // Body last-row cell combines start + 🃏 icon
    expect(
      screen.getByText(
        (content, el) => el?.tagName === "TD" && content === "A🃏",
      ),
    ).toBeInTheDocument();
    // Only header shows 🥇 (not the last scored row)
    expect(screen.getAllByText("🥇")).toHaveLength(1);
  });

  it("renders score values in table cells", () => {
    const data: ScoreRow[] = [
      { start: "B", bid: "4343", score1: 8, bags1: 2, score2: 5, bags2: 3 },
    ];
    render(<ScoreTable initials={initials} data={data} />);
    // Score and bags render as adjacent text nodes; the td's textContent joins them
    expect(
      screen.getByText(
        (content, el) => el?.tagName === "TD" && content === "82",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (content, el) => el?.tagName === "TD" && content === "53",
      ),
    ).toBeInTheDocument();
  });

  it("renders mod1 value when present", () => {
    const data: ScoreRow[] = [
      {
        start: "A",
        bid: "3234",
        score1: 6,
        bags1: 1,
        mod1: "🚫",
        score2: 4,
        bags2: 0,
      },
    ];
    render(<ScoreTable initials={initials} data={data} />);
    expect(screen.getByText("(🚫)", { exact: false })).toBeInTheDocument();
  });

  it("renders mod2 value when present", () => {
    const data: ScoreRow[] = [
      {
        start: "A",
        bid: "3234",
        score1: 6,
        bags1: 1,
        score2: 4,
        bags2: 2,
        mod2: "🎰",
      },
    ];
    render(<ScoreTable initials={initials} data={data} />);
    expect(screen.getByText("(🎰)", { exact: false })).toBeInTheDocument();
  });

  it("renders non-last rows without 🥇 or 🃏 icons", () => {
    const data: ScoreRow[] = [
      { start: "A", bid: "3234", score1: 6, bags1: 1, score2: 4, bags2: 0 },
      { start: "B", bid: "4343" },
    ];
    render(<ScoreTable initials={initials} data={data} />);
    // Last row has 🥇 (bid-only), first row should have no icon
    expect(screen.getByText("🥇")).toBeInTheDocument();
    expect(screen.queryByText("🃏")).not.toBeInTheDocument();
  });

  it("renders celebration emoji for winning score >= 100", () => {
    const data: ScoreRow[] = [
      {
        start: "A",
        bid: "3234",
        score1: 100,
        bags1: 0,
        score2: 80,
        bags2: 5,
      },
    ];
    render(<ScoreTable initials={initials} data={data} />);
    expect(screen.getByText(/🎉/)).toBeInTheDocument();
  });

  it("renders negative score formatted as score * 10 + bags", () => {
    const data: ScoreRow[] = [
      {
        start: "A",
        bid: "3234",
        score1: -2,
        bags1: 3,
        score2: 5,
        bags2: 1,
      },
    ];
    render(<ScoreTable initials={initials} data={data} />);
    expect(screen.getByText(/-20/)).toBeInTheDocument();
  });
});
