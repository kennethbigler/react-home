import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { bidsToString, penaltyHelper, getChipColor } from "./helpers";
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
    expect(penaltyHelper(12, 8, "120")).toEqual({
      score: 3,
      bags: 1,
      mod: "120😈💰",
    });
  });

  test("helpers | getChipColor", () => {
    expect(getChipColor(1, 2)).toEqual("error");
    expect(getChipColor(2, 1)).toEqual("success");
    expect(getChipColor(2, 2)).toEqual("default");
  });
});
