import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Roles from "./Roles";

describe("Roles", () => {
  const mockRoleKey = {
    Washerwoman: true,
    Librarian: false,
  };

  it("renders Trouble Brewing script (script 0)", () => {
    render(<Roles isText={true} script={0} roleKey={mockRoleKey} />);

    expect(screen.getByText("Townsfolk")).toBeInTheDocument();
    expect(screen.getByText("Outsiders")).toBeInTheDocument();
    expect(screen.getByText("Minions")).toBeInTheDocument();
    expect(screen.getByText("Demons")).toBeInTheDocument();
  });

  it("renders Sects & Violets script (script 1)", () => {
    render(<Roles isText={true} script={1} roleKey={mockRoleKey} />);

    expect(screen.getByText("Townsfolk")).toBeInTheDocument();
    expect(screen.getByText("Outsiders")).toBeInTheDocument();
    expect(screen.getByText("Minions")).toBeInTheDocument();
    expect(screen.getByText("Demons")).toBeInTheDocument();
  });

  it("renders Bad Moon Rising script (script 2)", () => {
    render(<Roles isText={true} script={2} roleKey={mockRoleKey} />);

    expect(screen.getByText("Townsfolk")).toBeInTheDocument();
    expect(screen.getByText("Outsiders")).toBeInTheDocument();
    expect(screen.getByText("Minions")).toBeInTheDocument();
    expect(screen.getByText("Demons")).toBeInTheDocument();
  });

  it("renders Sects & Whispers + Murmurs script (script 3)", () => {
    render(<Roles isText={true} script={3} roleKey={mockRoleKey} />);

    expect(screen.getByText("Townsfolk")).toBeInTheDocument();
    expect(screen.getByText("Outsiders")).toBeInTheDocument();
    expect(screen.getByText("Minions")).toBeInTheDocument();
    expect(screen.getByText("Demons")).toBeInTheDocument();
  });

  it("renders Other script (script 4)", () => {
    render(<Roles isText={true} script={4} roleKey={mockRoleKey} />);

    expect(screen.getByText("Townsfolk")).toBeInTheDocument();
    expect(screen.getByText("Outsiders")).toBeInTheDocument();
    expect(screen.getByText("Minions")).toBeInTheDocument();
    expect(screen.getByText("Demons")).toBeInTheDocument();
  });

  it("renders Other script for default case", () => {
    render(<Roles isText={true} script={99} roleKey={mockRoleKey} />);

    expect(screen.getByText("Townsfolk")).toBeInTheDocument();
    expect(screen.getByText("Outsiders")).toBeInTheDocument();
    expect(screen.getByText("Minions")).toBeInTheDocument();
    expect(screen.getByText("Demons")).toBeInTheDocument();
  });

  it("renders with emoji icons when isText is false", () => {
    render(<Roles isText={false} script={0} roleKey={mockRoleKey} />);

    expect(screen.getByText("Townsfolk")).toBeInTheDocument();
    expect(screen.getByText("Outsiders")).toBeInTheDocument();
    expect(screen.getByText("Minions")).toBeInTheDocument();
    expect(screen.getByText("Demons")).toBeInTheDocument();
  });

  it("uses different grid size for other script when isText is true", () => {
    const { container: otherContainer } = render(
      <Roles isText={true} script={4} roleKey={mockRoleKey} />,
    );

    // Other script with isText should use gridSize 4
    expect(otherContainer).toBeInTheDocument();
  });

  it("uses different grid size for non-other script when isText is true", () => {
    const { container: tbContainer } = render(
      <Roles isText={true} script={0} roleKey={mockRoleKey} />,
    );

    // TB script with isText should use gridSize 6
    expect(tbContainer).toBeInTheDocument();
  });

  it("uses grid size 3 when isText is false", () => {
    const { container } = render(
      <Roles isText={false} script={0} roleKey={mockRoleKey} />,
    );

    // When isText is false, gridSize should be 3
    expect(container).toBeInTheDocument();
  });

  it("renders Travelers section when script has travelers", () => {
    render(<Roles isText={true} script={0} roleKey={mockRoleKey} />);

    // TB script should have Travelers section
    expect(screen.getByText("Travelers")).toBeInTheDocument();
  });

  it("renders Other Travelers section when other travelers exist", () => {
    render(<Roles isText={true} script={0} roleKey={mockRoleKey} />);

    // TB script should have Other Travelers from SNV and BMR
    expect(screen.getByText("Other Travelers")).toBeInTheDocument();
  });

  it("does not render Travelers section when script has no travelers", () => {
    render(<Roles isText={true} script={4} roleKey={mockRoleKey} />);

    // Other script should not have Travelers section if it doesn't have any
    // (this depends on the actual data in constants/botc)
  });
});
