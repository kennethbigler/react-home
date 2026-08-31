import "../../../common/highcharts/tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import CarChart from "./CarChart";
import { cars } from "@/constants/cars";

describe("resume | cars | graphs | CarChart", () => {
  it("renders the car data chart", () => {
    render(<CarChart data={cars} color="white" />);

    expect(screen.getByText("Car Data")).toBeInTheDocument();
    expect(screen.getByTestId("highcharts-chart")).toBeInTheDocument();
  });

  it("renders an empty chart when no data is provided", () => {
    render(<CarChart data={[]} color="black" />);

    expect(screen.getByText("Car Data")).toBeInTheDocument();
  });
});
