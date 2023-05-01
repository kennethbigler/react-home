import * as React from "react";
import { render, screen } from "@testing-library/react";
import CruiseTable from "../CruiseTable";

describe("resume | travel-map | TravelMap", () => {
  it("renders as expected", () => {
    render(<CruiseTable />);

    expect(screen.getByText("Disney")).toBeInTheDocument();
    expect(screen.getByText("Royal Caribbean")).toBeInTheDocument();
  });
});
