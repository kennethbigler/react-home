import "../tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import CarSankeyGraph from "./CarSankeyGraph";
import {
  carSankeyData,
  familySankeyData,
  kenSankeyData,
} from "../../../../constants/cars";

describe("resume | cars | graphs | CarSankeyGraph", () => {
  it("renders the sankey chart title", () => {
    render(<CarSankeyGraph color="white" hideKen={false} hideFamily={false} />);

    expect(screen.getByText("Cars")).toBeInTheDocument();
  });

  it("uses all car flows by default", () => {
    render(<CarSankeyGraph color="white" hideKen={false} hideFamily={false} />);

    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-length",
      String(carSankeyData.length),
    );
  });

  it("uses family-only flows when Ken's cars are hidden", () => {
    render(<CarSankeyGraph color="white" hideKen={true} hideFamily={false} />);

    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-length",
      String(familySankeyData.length),
    );
  });

  it("uses Ken-only flows when family cars are hidden", () => {
    render(<CarSankeyGraph color="white" hideKen={false} hideFamily={true} />);

    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-length",
      String(kenSankeyData.length),
    );
  });

  it("renders no flows when both groups are hidden", () => {
    render(<CarSankeyGraph color="white" hideKen={true} hideFamily={true} />);

    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-length",
      "0",
    );
  });
});
