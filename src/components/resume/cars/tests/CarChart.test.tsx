import { render } from "@testing-library/react";
import CarChart from "../CarChart";
import { CarStats } from "../../../../constants/cars";

const data: CarStats[] = [
  {
    displacement: 5.0,
    horsepower: 4,
    MPG: 2,
    car: "car",
    char: "c",
    torque: 4,
    weight: 5,
  },
];

describe("resume | cars | CarChart", () => {
  it("renders as expected", () => {
    const { container } = render(
      <CarChart hide={{}} showAnimation vw={435} vh={900} data={data} />,
    );
    expect(
      container.querySelector(".recharts-responsive-container"),
    ).toHaveStyle({ width: "100%", height: "664px" });
  });

  it("renders with lower height", () => {
    const { container } = render(
      <CarChart hide={{}} showAnimation vw={435} vh={480} data={data} />,
    );
    expect(
      container.querySelector(".recharts-responsive-container"),
    ).toHaveStyle({ width: "100%", height: "400px" });
  });
});
