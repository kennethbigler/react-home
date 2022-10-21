import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import TravelTable from "../TravelTable";

describe("resume | travel-map | TravelMap", () => {
  it("renders as expected", async () => {
    const { container } = render(<TravelTable />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    expect(
      screen.getByText("I have been to 35 countries:")
    ).toBeInTheDocument();
    expect(screen.getByText("The Americas")).toBeInTheDocument();
    expect(screen.getByText("Europe & Africa")).toBeInTheDocument();
    expect(screen.getByText("Asia & Australia")).toBeInTheDocument();
    expect(screen.getByText("Bahamas 🇧🇸")).toBeInTheDocument();
  });
});
