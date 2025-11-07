import { render, screen } from "@testing-library/react";
import Bridge from ".";

describe("common | Bridge", () => {
  it("renders as expected", () => {
    render(<Bridge />);
    expect(screen.getByText("🌉")).toBeInTheDocument();
  });
});
