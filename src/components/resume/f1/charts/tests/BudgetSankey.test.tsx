import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BudgetSankey from "../BudgetSankey";

describe("resume | f1 | charts | BudgetSankey", () => {
  it("renders the budget title", () => {
    render(<BudgetSankey color="#ffffff" />);
    expect(screen.getAllByText("Budget")[0]).toBeInTheDocument();
  });

  it("renders a figure wrapper", () => {
    const { container } = render(<BudgetSankey color="#00ff00" />);
    expect(container.querySelector("figure")).toBeInTheDocument();
  });

  it("exposes the expected display name", () => {
    expect(BudgetSankey.displayName).toBe("BudgetSankey");
  });
});
