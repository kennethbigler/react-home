import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Work from "../Work";

describe("resume | work | Work", () => {
  it("renders as expected", () => {
    render(<Work />);

    expect(screen.getByText("Experience")).toBeInTheDocument();

    expect(screen.getByText("Work Timeline")).toBeInTheDocument();
    expect(screen.getByText("Tesla, Inc.")).toBeInTheDocument();
    expect(screen.getByText("Second Harvest Food Bank")).toBeInTheDocument();
    expect(screen.getByText("Santa Clara University BS")).toBeInTheDocument();
    expect(screen.getByText("Intuit")).toBeInTheDocument();

    expect(
      screen.getByText("Programming Language Timeline (Professional Use)")
    ).toBeInTheDocument();

    expect(screen.getByText("Work Experience")).toBeInTheDocument();
    expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
    expect(screen.getAllByText("Frontend Software Engineer")).toHaveLength(2);

    expect(screen.getByText("Volunteer Experience")).toBeInTheDocument();
    expect(
      screen.getByText("Midnight Game Club, Sunnyvale, CA")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Frontend Software Engineer and Project Manager")
    ).toBeInTheDocument();
  });

  it("expands and collapses on title click", () => {
    render(<Work />);

    expect(
      screen.getByText("Midnight Game Club, Sunnyvale, CA")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Frontend Software Engineer and Project Manager")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Midnight Game Club, Sunnyvale, CA"));
    expect(
      screen.queryByText("Frontend Software Engineer and Project Manager")
    ).toBeNull();
  });
});
