import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Menu from "./Menu";

describe("resume | Menu", () => {
  it("renders as expected", () => {
    render(<Menu />);

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
    render(<Menu onItemClick={handleItemClick} />);

    fireEvent.click(screen.getByText("Resume"));
    expect(handleItemClick).toHaveBeenCalledWith("/resume");
  });

  it("links to external sites", () => {
    const jsdomOpen = window.open;
    const windowOpen = vi.fn();
    window.open = windowOpen;

    render(<Menu />);

    fireEvent.click(screen.getByText("GitHub"));
    expect(windowOpen).toHaveBeenCalledWith(
      "https://github.com/kennethbigler/react-home",
    );

    fireEvent.click(screen.getByText("LinkedIn"));
    expect(windowOpen).toHaveBeenCalledWith(
      "https://www.linkedin.com/in/kennethbigler",
    );

    expect(windowOpen).toHaveBeenCalledTimes(2);

    window.alert = jsdomOpen;
  });
});
