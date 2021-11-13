import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import render from "../../../../redux-test-render";
import Header, { NavProps } from "../Header";

/** This is just used for testing purposes */
const Menu = ({ onItemClick }: NavProps): React.ReactElement<NavProps> => (
  <button onClick={(): void => onItemClick("button")} type="button">
    Test Button
  </button>
);

describe("common | header | Header", () => {
  it("renders with basic elements", () => {
    render(
      <Header>
        {(onItemClick): React.ReactElement<NavProps> => (
          <Menu onItemClick={onItemClick} />
        )}
      </Header>
    );
    // find TopBar elements
    expect(screen.getByTitle("Icon Menu Button")).toBeInTheDocument();
    expect(screen.getByTitle("Icon Menu Button").className).toContain(
      "MuiIconButton-colorInherit"
    );
    expect(screen.getByText("Menu")).toBeInTheDocument();
    // open the Drawer
    fireEvent.click(screen.getByTitle("Icon Menu Button"));
    // find Drawer elements
    expect(screen.getByTitle("Close Side Menu")).toBeInTheDocument();
    expect(screen.getAllByText("Menu")).toHaveLength(2);
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  describe("basic props tests", () => {
    it("displays children", () => {
      render(
        <Header>
          {(onItemClick): React.ReactElement<NavProps> => (
            <Menu onItemClick={onItemClick} />
          )}
        </Header>
      );
      // open the Drawer
      fireEvent.click(screen.getByTitle("Icon Menu Button"));
      // find Drawer elements
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("calls handleNav as expected", () => {
      const handleNav = jest.fn();

      render(
        <Header handleNav={handleNav}>
          {(onItemClick): React.ReactElement<NavProps> => (
            <Menu onItemClick={onItemClick} />
          )}
        </Header>
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

    it("showsPlayers as expected", () => {
      // render without player button
      const { rerender } = render(
        <Header>
          {(onItemClick): React.ReactElement<NavProps> => (
            <Menu onItemClick={onItemClick} />
          )}
        </Header>
      );
      expect(screen.queryByText("Players")).toBeNull();
      // rerender with player button
      rerender(
        <Header showPlayers>
          {(onItemClick): React.ReactElement<NavProps> => (
            <Menu onItemClick={onItemClick} />
          )}
        </Header>
      );
      expect(screen.getByText("Players")).toBeInTheDocument();
    });
  });
});
