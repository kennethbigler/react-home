import { render, screen } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import ShowStats from "./ShowStats";
import themeAtom, { darkTheme, lightTheme } from "../../../../jotai/theme-atom";

describe("games | spades | ShowStats", () => {
  const defaultProps = { initials: "ABCD" };

  it("renders the Stats button", () => {
    render(
      <Provider>
        <ShowStats {...defaultProps} />
      </Provider>,
    );
    expect(screen.getByText("Stats")).toBeInTheDocument();
  });

  it("opens popup and shows total chips in light mode", async () => {
    const store = createStore();
    store.set(themeAtom, lightTheme);

    render(
      <Provider store={store}>
        <ShowStats {...defaultProps} />
      </Provider>,
    );
    screen.getByText("Stats").click();
    expect(await screen.findByText("Totals:")).toBeInTheDocument();
    expect(screen.getByText("AC")).toBeInTheDocument();
    expect(screen.getByText("BD")).toBeInTheDocument();
  });

  it("renders correctly in dark mode", async () => {
    const store = createStore();
    store.set(themeAtom, darkTheme);

    render(
      <Provider store={store}>
        <ShowStats {...defaultProps} />
      </Provider>,
    );
    screen.getByText("Stats").click();
    expect(await screen.findByText("Totals:")).toBeInTheDocument();
  });
});
