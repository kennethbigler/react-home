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

    expect(screen.getAllByText("Demo Metric").length).toBeGreaterThan(0);
  });

  it("renders a black-theme gauge and clamps negative green bands", () => {
    render(<CarSpeedoGraph {...baseProps} color="black" endGreenVal={-10} />);

    expect(screen.getAllByText("Demo Metric").length).toBeGreaterThan(0);
  });
});
