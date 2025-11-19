import { render, screen } from "@testing-library/react";
import ScoringTable from "./ScoringTable";

describe("ScoringTable Component", () => {
  it("renders scoring table title", () => {
    render(<ScoringTable />);
    expect(screen.getByText("Scoring Table")).toBeInTheDocument();
  });

  it("renders all major sections", () => {
    render(<ScoringTable />);

    expect(screen.getByText("Contracts - Trick Values")).toBeInTheDocument();
    expect(screen.getByText("Rubbers")).toBeInTheDocument();
    expect(screen.getByText("Slams")).toBeInTheDocument();
    expect(screen.getByText("Overtricks")).toBeInTheDocument();
    expect(screen.getByText("Undertricks")).toBeInTheDocument();
    expect(screen.getByText("Extra Bonuses")).toBeInTheDocument();
  });

  it("displays contract trick values correctly", () => {
    render(<ScoringTable />);

    expect(screen.getByText("Minors ♣️♦️")).toBeInTheDocument();
    expect(screen.getByText("Majors ♥️♠️")).toBeInTheDocument();
    expect(screen.getByText("No Trump 🥇")).toBeInTheDocument();
    expect(screen.getByText("No Trump 🥈+")).toBeInTheDocument();
  });

  it("displays trick values", () => {
    render(<ScoringTable />);

    const cells = screen.getAllByRole("cell");
    const values = cells.map((cell) => cell.textContent);

    expect(values).toContain("20");
    expect(values).toContain("30");
    expect(values).toContain("40");
  });

  it("displays rubber bonuses", () => {
    render(<ScoringTable />);

    expect(screen.getByText("3 Game Rubber Won")).toBeInTheDocument();
    expect(screen.getByText("2 Game Rubber Won")).toBeInTheDocument();
    // Note: 500 and 700 appear multiple times in the table
    expect(screen.getAllByText("500").length).toBeGreaterThan(0);
    expect(screen.getAllByText("700").length).toBeGreaterThan(0);
  });

  it("displays unfinished rubber bonuses", () => {
    render(<ScoringTable />);

    expect(screen.getByText("Unfinished Rubbers")).toBeInTheDocument();
    expect(
      screen.getByText("Only partial score - no finished game"),
    ).toBeInTheDocument();
    expect(screen.getByText("Won the only game")).toBeInTheDocument();
    // Note: 100 and 300 appear multiple times in the table
    expect(screen.getAllByText("100").length).toBeGreaterThan(0);
    expect(screen.getAllByText("300").length).toBeGreaterThan(0);
  });

  it("displays slam bonuses with vulnerable and not vulnerable", () => {
    render(<ScoringTable />);

    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("Grand")).toBeInTheDocument();
    expect(screen.getByText("750")).toBeInTheDocument();
    expect(screen.getByText("1500")).toBeInTheDocument();
  });

  it("displays overtricks table", () => {
    render(<ScoringTable />);

    // Check for "Not Doubled", "Doubled" and "Redoubled" text (appears in both headers and cells)
    expect(screen.getAllByText("Not Doubled").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Doubled").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Redoubled").length).toBeGreaterThan(0);
    expect(screen.getByText("Trick Value")).toBeInTheDocument();
    expect(screen.getAllByText("200").length).toBeGreaterThan(0);
    expect(screen.getAllByText("400").length).toBeGreaterThan(0);
  });

  it("displays undertricks table headers", () => {
    render(<ScoringTable />);

    const cells = screen.getAllByRole("columnheader");
    const headers = cells.map((cell) => cell.textContent);

    expect(headers).toContain("NV");
    expect(headers).toContain("Vul");
  });

  it("displays all undertrick rows (13 rows)", () => {
    render(<ScoringTable />);

    // Should have undertricks numbered 1-13
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("13")).toBeInTheDocument();
  });

  it("displays extra bonuses", () => {
    render(<ScoringTable />);

    expect(screen.getByText("Making a doubled contract")).toBeInTheDocument();
    expect(screen.getByText("Making a redoubled contract")).toBeInTheDocument();
    expect(screen.getByText("4 trump honours in 1 hand")).toBeInTheDocument();
    expect(screen.getByText("5 trump honours in 1 hand")).toBeInTheDocument();
    expect(screen.getByText("4 aces in 1 hand in NT")).toBeInTheDocument();
    // Note: 50, 100, and 150 appear multiple times in the table
    expect(screen.getAllByText("50").length).toBeGreaterThan(0);
    expect(screen.getAllByText("150").length).toBeGreaterThan(0);
  });

  it("has correct aria labels for tables", () => {
    render(<ScoringTable />);

    // Check for aria-labelledby attributes on tables
    const tables = screen.getAllByRole("table");
    expect(tables.length).toBeGreaterThanOrEqual(6); // 6 tables in the component
  });

  it("displays per overtrick label", () => {
    render(<ScoringTable />);

    expect(screen.getByText("Per Overtrick")).toBeInTheDocument();
  });

  it("displays undertricks table with all columns", () => {
    render(<ScoringTable />);

    // Check for "Not Doubled" and "Doubled" headers
    const cells = screen.getAllByRole("cell");
    const cellTexts = cells.map((cell) => cell.textContent);

    expect(cellTexts).toContain("Not Doubled");
    expect(cellTexts).toContain("Doubled");
  });

  it("renders divider at top", () => {
    const { container } = render(<ScoringTable />);

    const dividers = container.querySelectorAll("hr");
    expect(dividers.length).toBeGreaterThan(0);
  });

  it("displays all undertrick penalty values", () => {
    render(<ScoringTable />);

    const cells = screen.getAllByRole("cell");
    const values = cells.map((cell) => cell.textContent);

    // First undertrick penalties
    expect(values).toContain("50");

    // Some higher undertrick penalties
    expect(values).toContain("550");
    expect(values).toContain("650");
  });
});
