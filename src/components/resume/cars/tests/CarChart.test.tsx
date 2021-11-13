import React from "react";
import { render } from "@testing-library/react";
import CarChart from "../CarChart";

const data = [
  {
    horsepower: 4,
    MPG: 2,
    short: "car",
    char: "c",
    weight: 5,
  },
];

describe("resume | cars | CarChart", () => {
  it("renders as expected", () => {
    const { container } = render(
      <CarChart hide={{}} showAnimation vw={435} data={data} />
    );
    expect(
      container.querySelector(".recharts-responsive-container")
    ).toBeInTheDocument();
  });
});
