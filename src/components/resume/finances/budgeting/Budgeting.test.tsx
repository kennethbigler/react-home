import { fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { describe, expect, it } from "vitest";
import compCalcAtom from "../../../../jotai/finances-atom";
import Budgeting from "./Budgeting";

describe("resume | finances | budgeting | Budgeting", () => {
  it("renders charts and expense controls", () => {
    const store = createStore();
    store.set(compCalcAtom, [
      {
        entryDate: "2020-01",
        salary: 100_000,
        bonus: 0,
        stockTick: "AAPL",
        priceThen: 100,
        grantDuration: 4,
        grantQty: 0,
      },
    ]);

    render(
      <Provider store={store}>
        <Budgeting />
      </Provider>,
    );

    expect(
      screen.getByRole("button", { name: "+ Expense" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("switch", { name: "Hide taxes" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "+ Expense" }));
    expect(screen.getByText("New Expense Entry")).toBeInTheDocument();
  });
});
