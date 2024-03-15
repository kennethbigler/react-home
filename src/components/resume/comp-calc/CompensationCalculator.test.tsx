import { render, screen } from "@testing-library/react";
import CompensationCalculator from "./CompensationCalculator";

describe("resume | comp-calc | CompensationCalculator", () => {
  it("renders as expected", () => {
    render(<CompensationCalculator />);

    expect(screen.getByText("Compensation Calculator")).toBeInTheDocument();
  });
});
