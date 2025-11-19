import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "jotai";
import Bridge from ".";

describe("Bridge Game Component", () => {
  it("renders the bridge game with header and score display", () => {
    render(
      <Provider>
        <Bridge />
      </Provider>,
    );

    expect(screen.getByText("🌉")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /score/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /bid/i })).toBeInTheDocument();
  });

  it("renders as expected", () => {
    render(
      <Provider>
        <Bridge />
      </Provider>,
    );
    expect(screen.getByText("🌉")).toBeInTheDocument();

    expect(screen.queryByText("Scoring Table")).toBeNull();
    fireEvent.click(screen.getByText("Score"));
    expect(screen.getByText("Scoring Table")).toBeInTheDocument();

    expect(screen.queryByText("Bridge Bidding Cheat Sheet Page 1")).toBeNull();
    fireEvent.click(screen.getByText("Bid"));
    expect(
      screen.getByAltText("Bridge Bidding Cheat Sheet Page 1"),
    ).toBeInTheDocument();
  });

  it("opens and closes scoring dialog", () => {
    render(
      <Provider>
        <Bridge />
      </Provider>,
    );

    expect(screen.queryByText("Scoring Table")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /score/i }));
    expect(screen.getByText("Scoring Table")).toBeInTheDocument();
  });

  it("opens and closes bid dialog", () => {
    render(
      <Provider>
        <Bridge />
      </Provider>,
    );

    expect(
      screen.queryByAltText("Bridge Bidding Cheat Sheet Page 1"),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /bid/i }));
    expect(
      screen.getByAltText("Bridge Bidding Cheat Sheet Page 1"),
    ).toBeInTheDocument();
  });

  it("displays initial score table", () => {
    render(
      <Provider>
        <Bridge />
      </Provider>,
    );

    expect(screen.getByText("We")).toBeInTheDocument();
    expect(screen.getByText("They")).toBeInTheDocument();
    expect(screen.getAllByText(/Total: 0/)).toHaveLength(2); // One for each team
    expect(screen.getAllByText(/Wins: 0/)).toHaveLength(2); // One for each team
  });
});
