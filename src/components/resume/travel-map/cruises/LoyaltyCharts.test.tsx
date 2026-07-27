import "../../../common/highcharts/tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import themeAtom, { lightTheme } from "../../../../jotai/theme-atom";
import { loyaltySeries } from "../../../../constants/cruises";
import LoyaltyCharts from "./LoyaltyCharts";

describe("resume | travel-map | cruises | LoyaltyCharts", () => {
  it("renders the cruise loyalty chart", () => {
    render(
      <Provider>
        <LoyaltyCharts />
      </Provider>,
    );

    expect(screen.getByText("Cruise Loyalty")).toBeInTheDocument();
    expect(screen.getAllByTestId("highcharts-series")).toHaveLength(
      loyaltySeries.length,
    );
  });

  it("renders in light mode", () => {
    const store = createStore();
    store.set(themeAtom, lightTheme);

    render(
      <Provider store={store}>
        <LoyaltyCharts />
      </Provider>,
    );

    expect(screen.getByText("Cruise Loyalty")).toBeInTheDocument();
  });
});
