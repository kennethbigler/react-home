import "../../../common/highcharts/tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import CarGraphs from "./CarGraphs";
import { cars, currentKensCars } from "@/constants/cars";
import themeAtom, { lightTheme } from "@/jotai/theme-atom";
import { renderWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";

describe("resume | cars | graphs | CarGraphs", () => {
  it("renders stats and chart sections for the active car", () => {
    render(<CarGraphs active={currentKensCars[0]} data={cars} />);

    expect(screen.getByText("Car Graphs")).toBeInTheDocument();
    expect(screen.getByText("Car Data")).toBeInTheDocument();
    expect(screen.getAllByText("Cars").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/0-60/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Horsepower/).length).toBeGreaterThan(0);
  });

  it("renders with light theme settings", () => {
    renderWithHydratedAtoms(
      <CarGraphs active={currentKensCars[0]} data={cars} />,
      [[themeAtom, lightTheme] as const],
    );

    expect(screen.getByText("Car Graphs")).toBeInTheDocument();
  });

  it("updates displayed stats when the active car changes", () => {
    const firstCar = cars[0];
    const secondCar = cars[1];

    const { rerender } = render(<CarGraphs active={firstCar} data={cars} />);

    expect(screen.getAllByText(`${firstCar.car} 0-60`).length).toBeGreaterThan(
      0,
    );

    rerender(<CarGraphs active={secondCar} data={cars} />);

    expect(screen.getAllByText(`${secondCar.car} 0-60`).length).toBeGreaterThan(
      0,
    );
  });
});
