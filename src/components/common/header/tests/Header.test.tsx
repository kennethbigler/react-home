import { ReactElement } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import { NavProps } from "../Header";
import Header from "..";

/** This is just used for testing purposes */
const Menu = ({ onItemClick }: NavProps): ReactElement<NavProps> => (
  <button onClick={(): void => onItemClick("button")} type="button">
    Test Button
  </button>
);

describe("common | header | Header", () => {
  it("renders with basic elements", () => {
    render(
      <Header>
        {(onItemClick): ReactElement<NavProps> => (
          <Menu onItemClick={onItemClick} />
        )}
      </Header>,
    );
    // find TopBar elements
    expect(screen.getByTitle("Icon Menu Button")).toBeInTheDocument();
    expect(screen.getByTitle("Icon Menu Button").className).toContain(
      "MuiIconButton-colorInherit",
    );
    expect(screen.getByText("Menu")).toBeInTheDocument();
    // open the Drawer
    fireEvent.click(screen.getByTitle("Icon Menu Button"));
    // find Drawer elements
    expect(screen.getByTitle("Close Side Menu")).toBeInTheDocument();
    expect(screen.getAllByText("Menu")).toHaveLength(2);
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("toggles theme", () => {
    const { container } = render(
      <Header>
        {(onItemClick): ReactElement<NavProps> => (
          <Menu onItemClick={onItemClick} />
        )}
      </Header>,
    );
    expect(
      container
        .querySelector("header")
        ?.classList.contains("header-dark-theme"),
    );
    fireEvent.click(screen.getByLabelText("Theme Toggle Switch"));
    let header = container.querySelector("header")?.classList;
    expect(!header?.contains("header-dark-theme"));
    expect(header?.contains("header-light-theme"));
    fireEvent.click(screen.getByLabelText("Theme Toggle Switch"));
    header = container.querySelector("header")?.classList;
    expect(!header?.contains("header-light-theme"));
    expect(header?.contains("header-dark-theme"));
  });

  describe("basic props tests", () => {
    it("displays children", () => {
      render(
        <Header>
          {(onItemClick): ReactElement<NavProps> => (
            <Menu onItemClick={onItemClick} />
          )}
        </Header>,
      );
      // open the Drawer
      fireEvent.click(screen.getByTitle("Icon Menu Button"));
      // find Drawer elements
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("calls handleNav as expected", () => {
      const handleNav = vi.fn();

      render(
        <Header handleNav={handleNav}>
          {(onItemClick): ReactElement<NavProps> => (
            <Menu onItemClick={onItemClick} />
          )}
        </Header>,
      );

      // open the Drawer
      fireEvent.click(screen.getByTitle("Icon Menu Button"));
      // find the button (child)
      expect(screen.getByText("Test Button")).toBeInTheDocument();
      // click the button
      expect(handleNav).not.toHaveBeenCalled();
      fireEvent.click(screen.getByText("Test Button"));
      expect(handleNav).toHaveBeenCalled();
    });
  });
});
