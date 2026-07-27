import "../../common/highcharts/tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import themeAtom, { lightTheme } from "../../../jotai/theme-atom";
import { vacationDays, workDays } from "../../../constants/travel";
import TravelDaysGraph from "./TravelDaysGraph";

describe("resume | travel-map | TravelDaysGraph", () => {
  it("renders the travel days chart", () => {
    render(
      <Provider>
        <TravelDaysGraph />
      </Provider>,
    );

    expect(screen.getByText("Travel Days")).toBeInTheDocument();
    expect(screen.getByTestId("highcharts-chart")).toBeInTheDocument();
    expect(screen.getAllByTestId("highcharts-series")).toHaveLength(2);
    expect(screen.getAllByTestId("highcharts-series")[0]).toHaveAttribute(
      "data-length",
      String(vacationDays.length),
    );
    expect(screen.getAllByTestId("highcharts-series")[1]).toHaveAttribute(
      "data-length",
      String(workDays.length),
    );
  });

  it("renders in light mode", () => {
    const store = createStore();
    store.set(themeAtom, lightTheme);

    render(
      <Provider store={store}>
        <TravelDaysGraph />
      </Provider>,
    );

    expect(screen.getByText("Travel Days")).toBeInTheDocument();
  });
});
