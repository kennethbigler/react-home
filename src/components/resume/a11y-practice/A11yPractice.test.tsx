import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import A11yPractice from "./A11yPractice";

describe("resume | a11y-practice | A11yPractice", () => {
  it("renders the page heading and tab list", () => {
    render(<A11yPractice />);

    expect(
      screen.getByRole("heading", { level: 1, name: "A11y Practice" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tablist", { name: /a11y practice tab examples/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Chunking", selected: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Chunking & Debounce" }),
    ).toBeInTheDocument();
  });

  it("shows the v1 stream example on the default tab", () => {
    render(<A11yPractice />);

    expect(
      screen.getByRole("button", { name: /start stream/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("sr-only");
  });

  it("switches to the debounce tab when selected", () => {
    render(<A11yPractice />);

    fireEvent.click(screen.getByRole("tab", { name: "Chunking & Debounce" }));

    expect(
      screen.getByRole("tab", { name: "Chunking & Debounce", selected: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /start stream/i }),
    ).toBeInTheDocument();
  });

  it("hides inactive tab panels", () => {
    render(<A11yPractice />);

    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels.length).toBeGreaterThan(0);
  });
});
