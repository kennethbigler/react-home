import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import { getChipColor } from "./helpers/getChipColor";
import Spades from ".";
import spadesAtom from "../../../jotai/spades-atom";

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

  it("shows Reset button when a team's score reaches 100", () => {
    const store = createStore();
    store.set(spadesAtom, (prev) => ({
      ...prev,
      data: [
        {
          start: "A",
          bid: "9999",
          score1: 100,
          bags1: 0,
          score2: 80,
          bags2: 2,
        },
      ],
    }));
    render(
      <Provider store={store}>
        <Spades />
      </Provider>,
    );
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
    expect(screen.queryByText("+ Bid")).not.toBeInTheDocument();
  });

  test("helpers | getChipColor", () => {
    expect(getChipColor(1, 2)).toEqual("error");
    expect(getChipColor(2, 1)).toEqual("success");
    expect(getChipColor(2, 2)).toEqual("default");
  });
});
