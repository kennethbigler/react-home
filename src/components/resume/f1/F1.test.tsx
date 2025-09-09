import { render, screen } from "@testing-library/react";
import F1 from ".";

describe("resume | f1 | F1", () => {
  it("renders as expected", () => {
    render(<F1 />);

    expect(screen.getByText("F1")).toBeInTheDocument();
    expect(
      screen.getByText("Constructor Budgets (Estimated)"),
    ).toBeInTheDocument();
  });
});
