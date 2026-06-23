import "../tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import CarGraphs from "./CarGraphs";
import { cars, currentKensCars } from "../../../../constants/cars";
import themeAtom, { lightTheme } from "../../../../jotai/theme-atom";

describe("resume | cars | graphs | CarGraphs", () => {
  it("renders stats and chart sections for the active car", () => {
    render(
      <CarGraphs
        active={currentKensCars[0]}
        data={cars}
        hideFamily={false}
        hideKen={false}
      />,
    );

    expect(screen.getByText("Car Graphs")).toBeInTheDocument();
    expect(screen.getByText("Car Data")).toBeInTheDocument();
    expect(screen.getAllByText("Cars").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/0-60/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Horsepower/).length).toBeGreaterThan(0);
  });

  it("renders with light theme settings", () => {
    const store = createStore();
    store.set(themeAtom, lightTheme);

    render(
      <Provider store={store}>
        <CarGraphs
          active={currentKensCars[0]}
          data={cars}
          hideFamily={false}
          hideKen={false}
        />
      </Provider>,
    );

    expect(screen.getByText("Car Graphs")).toBeInTheDocument();
  });

  it("updates displayed stats when the active car changes", () => {
    const firstCar = cars[0];
    const secondCar = cars[1];

    const { rerender } = render(
      <CarGraphs
        active={firstCar}
        data={cars}
        hideFamily={false}
        hideKen={false}
      />,
    );

    expect(screen.getAllByText(`${firstCar.car} 0-60`).length).toBeGreaterThan(
      0,
    );

    rerender(
      <CarGraphs
        active={secondCar}
        data={cars}
        hideFamily={false}
        hideKen={false}
      />,
    );

    expect(screen.getAllByText(`${secondCar.car} 0-60`).length).toBeGreaterThan(
      0,
    );
  });
});
