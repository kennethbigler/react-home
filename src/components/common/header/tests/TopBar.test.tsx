import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import TopBar from "../TopBar";

describe("common | header | TopBar", () => {
  describe("basic props tests", () => {
    it("changes textColor as expected", () => {
      const { rerender } = render(
        <TopBar textColor="primary" toggleOpen={vi.fn()} />,
      );
      expect(screen.getByTitle("Icon Menu Button").className).toContain(
        "MuiIconButton-colorPrimary",
      );

      rerender(<TopBar textColor="secondary" toggleOpen={vi.fn()} />);
      expect(screen.getByTitle("Icon Menu Button").className).toContain(
        "MuiIconButton-colorSecondary",
      );
    });

    it("toggles open as expected", () => {
      const handleOpen = vi.fn();
      render(<TopBar textColor="primary" toggleOpen={handleOpen} />);
      fireEvent.click(screen.getByText("Menu"));
      expect(handleOpen).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByTitle("Icon Menu Button"));
      expect(handleOpen).toHaveBeenCalledTimes(2);
    });
  });

  describe("theme toggle", () => {
    it("toggles theme as expected", () => {
      const handleOpen = vi.fn();
      const { container } = render(
        <TopBar textColor="primary" toggleOpen={handleOpen} />,
      );
      const ThemeToggle = screen.getByLabelText("Theme Toggle Switch");

      expect(ThemeToggle?.attributes?.getNamedItem("value")?.value).toEqual(
        "false",
      );
      expect(container.querySelector(".header-light-theme")).toBeNull();
      expect(container.querySelector(".header-dark-theme")).toBeInTheDocument();

      fireEvent.click(
        ThemeToggle || screen.getByLabelText("Theme Toggle Switch"),
      );

      expect(ThemeToggle?.attributes?.getNamedItem("value")?.value).toEqual(
        "true",
      );
      expect(
        container.querySelector(".header-light-theme"),
      ).toBeInTheDocument();
      expect(container.querySelector(".header-dark-theme")).toBeNull();
    });
  });
});
