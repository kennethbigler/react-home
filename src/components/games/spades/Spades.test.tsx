import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Spades from ".";

describe("games | spades | Spades", () => {
  it("renders as expected", async () => {
    render(<Spades />);

    expect(screen.getByText("♠️ Scores")).toBeInTheDocument();
    // open bids
    expect(screen.queryByText("Bid (1 Bag)")).toBeNull();
    fireEvent.click(screen.getByText("+ Bid"));
    expect(screen.getByText("Bid (1 Bag)")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => expect(screen.queryByText("Bid (1 Bag)")).toBeNull());
    // open score
    expect(screen.queryByText("⚠️ Tricks: 12")).toBeNull();
    fireEvent.click(screen.getByText("+ Score"));
    expect(screen.getByText("⚠️ Tricks: 12")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => expect(screen.queryByText("⚠️ Tricks: 12")).toBeNull());
  });
});
