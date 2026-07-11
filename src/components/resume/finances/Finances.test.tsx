import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Finances from "./Finances";

describe("resume | finances | Finances", () => {
  it("renders the page heading and tab list", () => {
    render(<Finances />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Finances" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tablist", { name: /a11y practice tab examples/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Comp Calculator", selected: true }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Budgeting" })).toBeInTheDocument();
  });

  it("shows the comp calculator on the default tab", () => {
    render(<Finances />);

    expect(screen.getByRole("button", { name: "+ Entry" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+ Stock" })).toBeInTheDocument();
  });

  it("switches to the budgeting tab when selected", () => {
    render(<Finances />);

    fireEvent.click(screen.getByRole("tab", { name: "Budgeting" }));

    expect(
      screen.getByRole("tab", { name: "Budgeting", selected: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "+ Expense" }),
    ).toBeInTheDocument();
  });

  it("hides inactive tab panels", () => {
    render(<Finances />);

    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels.length).toBe(2);
  });
});
