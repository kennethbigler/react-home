import { render, screen } from "@testing-library/react";
import TravelMap from "../TravelMap";

describe("resume | travel-map", () => {
  it("renders as expected", () => {
    render(<TravelMap />);

    expect(screen.getByText("Travel")).toBeInTheDocument();
  });
});
