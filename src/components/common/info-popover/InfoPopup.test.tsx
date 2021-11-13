import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import InfoPopup from "./InfoPopup";

describe("common | InfoPopup", () => {
  it("renders as expected", () => {
    render(
      <InfoPopup title="Title" buttonText="Button">
        Child
      </InfoPopup>
    );
    expect(screen.getByText("Button")).toBeInTheDocument();
    expect(screen.queryByText("Title")).toBeNull();
    expect(screen.queryByText("Child")).toBeNull();
    fireEvent.click(screen.getByText("Button"));
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("displays Title as buttonText if no buttonText is provided", () => {
    render(<InfoPopup title="Title">Child</InfoPopup>);
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("opens and closes as expected", () => {
    render(
      <InfoPopup title="Title" buttonText="Button">
        Child
      </InfoPopup>
    );
    expect(screen.getByText("Button")).toBeInTheDocument();
    // check that it opens
    expect(screen.queryByText("Title")).toBeNull();
    expect(screen.queryByText("Child")).toBeNull();
    fireEvent.click(screen.getByText("Button"));
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
    // check that it closes
    expect(screen.getByTitle("info-popup").firstChild).toHaveStyle({
      opacity: 1,
    });
    fireEvent.click(screen.getByText("Close"));
    expect(screen.getByTitle("info-popup").firstChild).toHaveStyle({
      opacity: 0,
    });
  });
});
