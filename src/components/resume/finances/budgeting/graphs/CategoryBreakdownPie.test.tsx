import { getPieSeriesData } from "../../../../common/highcharts/tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { describe, expect, it } from "vitest";
import themeAtom, {
  darkTheme,
  lightTheme,
} from "../../../../../jotai/theme-atom";
import CategoryBreakdownPie from "./CategoryBreakdownPie";

describe("resume | finances | budgeting | CategoryBreakdownPie", () => {
  it("renders category pie data in light mode", () => {
    const store = createStore();
    store.set(themeAtom, lightTheme);

    render(
      <Provider store={store}>
        <CategoryBreakdownPie
          title="By Category"
          data={[
            { name: "HOUSING", y: 2000 },
            { name: "FOOD", y: 500 },
          ]}
        />
      </Provider>,
    );

    expect(screen.getByText("By Category")).toBeInTheDocument();
    expect(getPieSeriesData()).toEqual([
      expect.objectContaining({ name: "HOUSING", y: 2000 }),
      expect.objectContaining({ name: "FOOD", y: 500 }),
    ]);
  });

  it("renders with dark theme title styling", () => {
    const store = createStore();
    store.set(themeAtom, darkTheme);

    render(
      <Provider store={store}>
        <CategoryBreakdownPie
          title="By Category"
          data={[{ name: "HOUSING", y: 2000 }]}
        />
      </Provider>,
    );

    expect(screen.getByText("By Category")).toBeInTheDocument();
  });
});
