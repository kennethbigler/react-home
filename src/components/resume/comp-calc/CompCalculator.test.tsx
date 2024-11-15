import { screen } from "@testing-library/react";
import CompCalculator from "./CompCalculator";
import render from "../../../recoil-test-render";

describe("resume | comp-calc | CompCalculator", () => {
  it("renders as expected", () => {
    render(<CompCalculator />);

    expect(screen.getByText("Comp Calculator")).toBeInTheDocument();
  });
});
