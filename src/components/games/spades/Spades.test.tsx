import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import {
  bidsToString,
  penaltyHelper,
  getChipColor,
  getScore,
  getMetrics,
} from "./helpers";
import Spades from ".";

describe("games | spades | Spades", () => {
  it("renders as expected", async () => {
    render(<Spades />);

    expect(screen.getByText("♠️🧮")).toBeInTheDocument();
    // open & close bids
    expect(screen.queryByText("Bid (1 💰)")).toBeNull();
    fireEvent.click(screen.getByText("+ Bid"));
    expect(screen.getByText("Bid (1 💰)")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => expect(screen.queryByText("Bid (1 💰)")).toBeNull());
    // save bid
    expect(screen.queryByText("Bid (1 💰)")).toBeNull();
    fireEvent.click(screen.getByText("+ Bid"));
    expect(screen.getByText("Bid (1 💰)")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(screen.queryByText("Bid (1 💰)")).toBeNull());
    // open & close score
    expect(screen.queryByText("⚠️ Tricks: 12")).toBeNull();
    fireEvent.click(screen.getByText("+ Score"));
    expect(screen.getByText("⚠️ Tricks: 12")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => expect(screen.queryByText("⚠️ Tricks: 12")).toBeNull());
    // save score
    expect(screen.queryByText("⚠️ Tricks: 12")).toBeNull();
    fireEvent.click(screen.getByText("+ Score"));
    expect(screen.getByText("⚠️ Tricks: 12")).toBeInTheDocument();
    fireEvent.click(screen.getAllByLabelText("increase")[0]);
    expect(screen.getByText("Tricks: 13")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(screen.queryByText("Tricks: 13")).toBeNull());
    // open metrics
    expect(screen.queryByText("Totals:")).toBeNull();
    fireEvent.click(screen.getByText("Stats"));
    expect(screen.getByText("Totals:")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Close")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => expect(screen.queryByText("Totals:")).toBeNull());
  });

  test("helpers | bidsToString", () => {
    expect(
      bidsToString([
        { bid: 0, blind: true, train: false },
        { bid: 0, blind: false, train: false },
        { bid: 10, blind: false, train: true },
        { bid: 10, blind: false, train: false },
      ]),
    ).toEqual("🦮🚫🚂,10,");
  });

  test("helpers | penaltyHelper", () => {
    expect(penaltyHelper(12, 3)).toEqual({
      score: 12,
      bags: 6,
      mod: "😈",
    });
    expect(penaltyHelper(12, 8, "🚫")).toEqual({
      score: 3,
      bags: 1,
      mod: "🚫😈💰",
    });
  });

  test("helpers | getChipColor", () => {
    expect(getChipColor(1, 2)).toEqual("error");
    expect(getChipColor(2, 1)).toEqual("success");
    expect(getChipColor(2, 2)).toEqual("default");
  });

  test("helpers | getScore", () => {
    // double blind nil
    expect(
      getScore(
        { bid: 0, blind: true, train: false, made: 0 },
        { bid: 0, blind: true, train: false, made: 0 },
        1,
        2,
      ),
    ).toEqual({ score: 81, bags: 2, mod: "" });
    expect(
      getScore(
        { bid: 0, blind: true, train: false, made: 5 },
        { bid: 0, blind: true, train: false, made: 6 },
        1,
        2,
      ),
    ).toEqual({ score: -8, bags: 3, mod: "🚫🚫💰" });

    // double nils with 1 blind
    expect(
      getScore(
        { bid: 0, blind: true, train: false, made: 0 },
        { bid: 0, blind: false, train: false, made: 0 },
        1,
        2,
      ),
    ).toEqual({ score: 61, bags: 2, mod: "" });
    expect(
      getScore(
        { bid: 0, blind: true, train: false, made: 0 },
        { bid: 0, blind: false, train: false, made: 1 },
        1,
        2,
      ),
    ).toEqual({ score: 31, bags: 3, mod: "🚫" });
    expect(
      getScore(
        { bid: 0, blind: false, train: false, made: 1 },
        { bid: 0, blind: true, train: false, made: 0 },
        1,
        2,
      ),
    ).toEqual({ score: 31, bags: 3, mod: "🚫" });
    expect(
      getScore(
        { bid: 0, blind: true, train: false, made: 1 },
        { bid: 0, blind: false, train: false, made: 0 },
        1,
        2,
      ),
    ).toEqual({ score: 1, bags: 3, mod: "🚫" });
    expect(
      getScore(
        { bid: 0, blind: true, train: false, made: 1 },
        { bid: 0, blind: false, train: false, made: 1 },
        1,
        2,
      ),
    ).toEqual({ score: -29, bags: 4, mod: "🚫🚫" });

    // double nils
    expect(
      getScore(
        { bid: 0, blind: false, train: false, made: 0 },
        { bid: 0, blind: false, train: false, made: 0 },
        1,
        2,
      ),
    ).toEqual({ score: 41, bags: 2, mod: "" });
    expect(
      getScore(
        { bid: 0, blind: false, train: false, made: 0 },
        { bid: 0, blind: false, train: false, made: 1 },
        1,
        2,
      ),
    ).toEqual({ score: 1, bags: 3, mod: "🚫" });
    expect(
      getScore(
        { bid: 0, blind: false, train: false, made: 1 },
        { bid: 0, blind: false, train: false, made: 1 },
        1,
        2,
      ),
    ).toEqual({ score: -19, bags: 4, mod: "🚫🚫" });

    // trains
    expect(
      getScore(
        { bid: 7, blind: false, train: false, made: 9 },
        { bid: 3, blind: false, train: true, made: 2 },
        1,
        2,
      ),
    ).toEqual({ score: 21, bags: 3, mod: "" });
    expect(
      getScore(
        { bid: 7, blind: false, train: false, made: 8 },
        { bid: 3, blind: false, train: true, made: 1 },
        1,
        2,
      ),
    ).toEqual({ score: -19, bags: 2, mod: "🚂" });

    // nils p1
    expect(
      getScore(
        { bid: 0, blind: true, train: false, made: 0 },
        { bid: 3, blind: false, train: false, made: 4 },
        1,
        2,
      ),
    ).toEqual({ score: 24, bags: 3, mod: "" });
    expect(
      getScore(
        { bid: 0, blind: false, train: false, made: 0 },
        { bid: 3, blind: false, train: false, made: 4 },
        1,
        2,
      ),
    ).toEqual({ score: 14, bags: 3, mod: "" });
    expect(
      getScore(
        { bid: 0, blind: false, train: false, made: 1 },
        { bid: 3, blind: false, train: false, made: 4 },
        1,
        2,
      ),
    ).toEqual({ score: -6, bags: 4, mod: "🚫" });

    // nils p2
    expect(
      getScore(
        { bid: 3, blind: false, train: false, made: 4 },
        { bid: 0, blind: true, train: false, made: 0 },
        1,
        2,
      ),
    ).toEqual({ score: 24, bags: 3, mod: "" });
    expect(
      getScore(
        { bid: 3, blind: false, train: false, made: 4 },
        { bid: 0, blind: false, train: false, made: 0 },
        1,
        2,
      ),
    ).toEqual({ score: 14, bags: 3, mod: "" });
    expect(
      getScore(
        { bid: 3, blind: false, train: false, made: 4 },
        { bid: 0, blind: false, train: false, made: 1 },
        1,
        2,
      ),
    ).toEqual({ score: -6, bags: 4, mod: "🚫" });

    // missed bid
    expect(
      getScore(
        { bid: 3, blind: false, train: false, made: 3 },
        { bid: 3, blind: false, train: false, made: 2 },
        1,
        2,
      ),
    ).toEqual({ score: -5, bags: 2, mod: "🎰" });
  });

  test("helpers | getMetrics", () => {
    expect(
      getMetrics(
        [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ], // nils
        [0, 0, 0, 0, 0], // lifeBags
        0, // first: number,
        [
          { bid: 3, blind: false, train: false },
          { bid: 3, blind: false, train: false },
          { bid: 3, blind: false, train: false },
          { bid: 3, blind: false, train: false },
        ], // lastBid
        [3, 3, 3, 4], // mades
        [0, 0, 0, 0], // missedBids
      ),
    ).toEqual({
      newNils: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      newMissedBids: [0, 0, 0, 0],
      newLifeBags: [0, 0, 0, 1, 0.25],
    });
  });
});
