import "../tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import themeAtom, { lightTheme } from "../../../../jotai/theme-atom";
import { cruiseData } from "../../../../constants/cruises";
import CruiseSankeyGraph from "./CruiseSankeyGraph";

describe("resume | travel-map | cruises | CruiseSankeyGraph", () => {
  it("renders the cruise sankey chart", () => {
    render(
      <Provider>
        <CruiseSankeyGraph />
      </Provider>,
    );

    expect(screen.getByText("Cruises")).toBeInTheDocument();
    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-length",
      String(cruiseData.data.length),
    );
    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-type",
      "sankey",
    );
  });

  it("renders in light mode", () => {
    const store = createStore();
    store.set(themeAtom, lightTheme);

    render(
      <Provider store={store}>
        <CruiseSankeyGraph />
      </Provider>,
    );

    expect(screen.getByText("Cruises")).toBeInTheDocument();
  });
});
