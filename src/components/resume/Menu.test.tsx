import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Menu from "./Menu";

describe("resume | Menu", () => {
  const renderMenu = (onItemClick?: (loc: string) => void) =>
    render(
      <MemoryRouter>
        <Menu onItemClick={onItemClick} />
      </MemoryRouter>,
    );

  it("renders as expected", () => {
    renderMenu();

    expect(screen.getByText("Summary")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Resume")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Presentations")).toBeInTheDocument();
    expect(screen.getByText("Cars")).toBeInTheDocument();
    expect(screen.getByText("Travel Map")).toBeInTheDocument();
    expect(screen.getByText("Games")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
  });

  it("links to internal pages", () => {
    const handleItemClick = vi.fn();
    renderMenu(handleItemClick);

    const resumeLink = screen.getByRole("menuitem", { name: "Resume" });
    expect(resumeLink).toHaveAttribute("href", "/resume");
    fireEvent.click(resumeLink);
    expect(handleItemClick).toHaveBeenCalledWith("/resume");
  });

  it("links to external sites", () => {
    renderMenu();

    expect(
      screen.getByRole("menuitem", { name: "GitHub (opens in new tab)" }),
    ).toHaveAttribute("href", "https://github.com/kennethbigler/react-home");
    expect(
      screen.getByRole("menuitem", { name: "LinkedIn (opens in new tab)" }),
    ).toHaveAttribute("href", "https://www.linkedin.com/in/kennethbigler");
  });
});
