import { getSeriesByName } from "../../../common/highcharts/tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import CarSankeyGraph from "./CarSankeyGraph";
import {
  buildCarSankeyFromCars,
  buildCarSankeyNodes,
} from "@/constants/car-brands";
import { cars, hideFamilyCars, hideKenCars } from "@/constants/cars";

describe("resume | cars | graphs | CarSankeyGraph", () => {
  it("renders the sankey chart title", () => {
    render(<CarSankeyGraph color="white" data={cars} />);

    expect(screen.getByText("Cars")).toBeInTheDocument();
  });

  it("uses all car flows by default", () => {
    render(<CarSankeyGraph color="white" data={cars} />);

    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-length",
      String(buildCarSankeyFromCars(cars).length),
    );
  });

  it("uses family-only flows when Ken's cars are hidden", () => {
    render(<CarSankeyGraph color="white" data={hideKenCars} />);

    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-length",
      String(buildCarSankeyFromCars(hideKenCars).length),
    );
  });

  it("uses Ken-only flows when family cars are hidden", () => {
    render(<CarSankeyGraph color="white" data={hideFamilyCars} />);

    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-length",
      String(buildCarSankeyFromCars(hideFamilyCars).length),
    );
  });

  it("renders no flows when no cars are shown", () => {
    render(<CarSankeyGraph color="white" data={[]} />);

    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-length",
      "0",
    );
  });

  it("uses the static brand-registry node layout", () => {
    render(<CarSankeyGraph color="white" data={cars} />);

    expect(screen.getByTestId("highcharts-series")).toBeInTheDocument();
    const nodes = getSeriesByName("Cars")?.nodes as
      | Array<{ id: string }>
      | undefined;
    expect(nodes?.some((node) => node.id === "Porsche")).toBe(true);
    expect(nodes).toEqual(buildCarSankeyNodes());
  });
});
