import * as React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import render from "../../../../recoil-test-render";
import TopBar from "../TopBar";

describe("common | header | TopBar", () => {
  describe("basic props tests", () => {
    it("changes textColor as expected", () => {
      const { rerender } = render(
        <TopBar textColor="primary" toggleOpen={vi.fn()} />
      );
      expect(screen.getByTitle("Icon Menu Button").className).toContain(
        "MuiIconButton-colorPrimary"
      );

      rerender(<TopBar textColor="secondary" toggleOpen={vi.fn()} />);
      expect(screen.getByTitle("Icon Menu Button").className).toContain(
        "MuiIconButton-colorSecondary"
      );
    });

    it("shows players as expected", () => {
      const { rerender } = render(
        <TopBar textColor="primary" toggleOpen={vi.fn()} showPlayers />
      );
      expect(screen.getByText("Players")).toBeInTheDocument();

      rerender(
        <TopBar textColor="primary" toggleOpen={vi.fn()} showPlayers={false} />
      );
      expect(screen.queryByText("Players")).toBeNull();
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
        <TopBar textColor="primary" toggleOpen={handleOpen} />
      );
      const ThemeToggle = screen
        .getByTitle("Theme Toggle Switch")
        .querySelector(".MuiSwitch-input");

      expect(ThemeToggle?.attributes?.getNamedItem("value")?.value).toEqual(
        "false"
      );
      expect(container.querySelector(".header-light-theme")).toBeNull();
      expect(container.querySelector(".header-dark-theme")).toBeInTheDocument();

      fireEvent.click(ThemeToggle || screen.getByTitle("Theme Toggle Switch"));

      expect(ThemeToggle?.attributes?.getNamedItem("value")?.value).toEqual(
        "true"
      );
      expect(
        container.querySelector(".header-light-theme")
      ).toBeInTheDocument();
      expect(container.querySelector(".header-dark-theme")).toBeNull();
    });
  });
});
