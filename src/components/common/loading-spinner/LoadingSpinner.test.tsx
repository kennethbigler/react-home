import { render, screen } from "@testing-library/react";
import LoadingSpinner from ".";

describe("common | LoadingSpinner", () => {
  it("renders as expected", () => {
    render(<LoadingSpinner />);
    expect(screen.getByTitle("Loading Spinner")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
