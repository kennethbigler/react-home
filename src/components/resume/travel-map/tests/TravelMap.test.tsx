import React from "react";
import { render, screen } from "@testing-library/react";
import TravelMap from "../TravelMap";

describe("resume | travel-map | TravelMap", () => {
  it("renders as expected", () => {
    render(<TravelMap />);

    expect(screen.getByText("My Travel Map")).toBeInTheDocument();
    expect(
      screen.getByText("I have been to 32 countries:")
    ).toBeInTheDocument();
    expect(screen.getByText("North America")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
    expect(screen.getByText("Bahamas 🇧🇸")).toBeInTheDocument();
  });
});
