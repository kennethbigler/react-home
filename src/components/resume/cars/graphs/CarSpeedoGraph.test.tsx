import {
  getSeriesByName,
  getYAxes,
} from "../../../common/highcharts/tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import CarSpeedoGraph from "./CarSpeedoGraph";

describe("resume | cars | graphs | CarSpeedoGraph", () => {
  const baseProps = {
    val: 42,
    name: "Demo",
    maxVal: 100,
    label: "units",
    title: "Metric",
    endGreenVal: 20,
    startRedVal: 80,
  } as const;

  it("renders a white-theme gauge", () => {
    render(<CarSpeedoGraph {...baseProps} color="white" />);

    expect(screen.getByText("Demo Metric")).toBeInTheDocument();
    expect(screen.getByTestId("highcharts-chart")).toBeInTheDocument();
    expect(getSeriesByName("Demo")?.type).toBe("gauge");
    expect(getSeriesByName("Demo")?.data).toEqual([42]);
    expect(getYAxes().at(-1)).toMatchObject({
      min: 0,
      max: 100,
      endOnTick: false,
      startOnTick: false,
    });
    expect(getYAxes().at(-1)?.plotBands).toEqual(
      expect.arrayContaining([expect.objectContaining({ from: 80, to: 100 })]),
    );
  });

  it("renders a black-theme gauge and clamps negative green bands", () => {
    render(<CarSpeedoGraph {...baseProps} color="black" endGreenVal={-10} />);

    expect(screen.getByText("Demo Metric")).toBeInTheDocument();
    expect(getSeriesByName("Demo")?.data).toEqual([42]);
  });
});
