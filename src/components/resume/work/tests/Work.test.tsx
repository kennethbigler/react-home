import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from 'vitest';
import Work from "../Work";

const { ResizeObserver } = window;

beforeEach(() => {
  // @ts-expect-error: TODO: overwriting to get rid of recharts error, remove later
  delete window.ResizeObserver;
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  vi.restoreAllMocks();
});

describe("resume | work | Work", () => {
  it("renders as expected", () => {
    render(<Work />);

    expect(screen.getByText("Experience")).toBeInTheDocument();

    expect(screen.getByText("Work Timeline")).toBeInTheDocument();
    expect(screen.getByText("Second Harvest Food Bank")).toBeInTheDocument();
    expect(screen.getByText("Santa Clara University BS")).toBeInTheDocument();
    expect(screen.getByText("Intuit")).toBeInTheDocument();

    expect(
      screen.getByText("Programming Language Timeline (Professional Use)")
    ).toBeInTheDocument();

    expect(screen.getByText("work Experience")).toBeInTheDocument();
    expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
    expect(
      screen.getByText("Accessibility Engineering Leader")
    ).toBeInTheDocument();
    expect(screen.getByText("Frontend Software Engineer")).toBeInTheDocument();

    expect(screen.getByText("volunteer Experience")).toBeInTheDocument();
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
