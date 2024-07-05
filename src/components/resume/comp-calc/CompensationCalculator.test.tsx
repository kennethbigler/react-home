import { screen } from "@testing-library/react";
import CompensationCalculator from "./CompensationCalculator";
import render from "../../../recoil-test-render";

describe("resume | comp-calc | CompensationCalculator", () => {
  it("renders as expected", () => {
    render(<CompensationCalculator />);

    expect(screen.getByText("Comp Calculator")).toBeInTheDocument();
  });
});
