import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import InfoPopup from "./InfoPopup";

describe("common | InfoPopup", () => {
  it("renders as expected", () => {
    render(
      <InfoPopup title="Title" buttonText="Button">
        Child
      </InfoPopup>,
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

  it("opens and closes as expected", async () => {
    render(
      <InfoPopup title="Title" buttonText="Button">
        Child
      </InfoPopup>,
    );
    expect(screen.getByText("Button")).toBeInTheDocument();
    // check that it opens
    expect(screen.queryByText("Title")).toBeNull();
    expect(screen.queryByText("Child")).toBeNull();
    fireEvent.click(screen.getByText("Button"));
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // check that it closes
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("supports a save button prop", () => {
    const handleSave = vi.fn();
    render(
      <InfoPopup title="Title" buttonText="Button" onSave={handleSave}>
        Child
      </InfoPopup>,
    );
    expect(screen.getByText("Button")).toBeInTheDocument();
    // check that it opens
    expect(screen.queryByText("Title")).toBeNull();
    expect(screen.queryByText("Child")).toBeNull();
    fireEvent.click(screen.getByText("Button"));
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
    // check that it saves
    expect(handleSave).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Save"));
    expect(handleSave).toHaveBeenCalled();
  });
});
