import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import CruiseTable from "../CruiseTable";

describe("resume | travel-map | TravelMap", () => {
  it("passes axe", async () => {
    const { container } = render(<CruiseTable />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders as expected", () => {
    render(<CruiseTable />);

    expect(screen.getByText("Disney")).toBeInTheDocument();
    expect(screen.getByText("Royal Caribbean")).toBeInTheDocument();
  });
});
