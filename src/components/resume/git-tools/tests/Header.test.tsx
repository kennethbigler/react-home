import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Header from "../Header";

describe("resume | git-tools | Header", () => {
  it("renders as expected", () => {
    const handleIdChange = vi.fn();
    render(
      <Header gitTheme="red" onIdChange={handleIdChange} storyID="KEN-1234" />,
    );

    expect(screen.getByText("Git Tools")).toBeInTheDocument();
    expect(screen.getAllByText("User Story ID")).toHaveLength(2);
    expect(screen.getByDisplayValue("KEN-1234")).toBeInTheDocument();

    expect(screen.getAllByText("User Story ID")[0]).toHaveStyle(
      "color: rgb(255, 0, 0);",
    );
  });

  it("handles id changes", () => {
    const handleIdChange = vi.fn();
    render(<Header gitTheme="red" onIdChange={handleIdChange} />);

    fireEvent.change(
      screen.getAllByText("User Story ID")[0].nextSibling!.firstChild!,
      { target: { value: "KEN-1234" } },
    );
    expect(handleIdChange).toHaveBeenCalledTimes(1);
  });

  it("displays an error when ticket of the wrong format is provided", () => {
    const handleIdChange = vi.fn();
    render(
      <Header gitTheme="red" onIdChange={handleIdChange} storyID="1234" />,
    );

    expect(screen.getByText("Git Tools")).toBeInTheDocument();
    expect(screen.getAllByText("User Story ID")).toHaveLength(2);
    expect(screen.getByDisplayValue("1234")).toBeInTheDocument();
    expect(
      screen
        .getAllByText("User Story ID")[0]
        .parentNode?.querySelector(".Mui-error"),
    ).toBeInTheDocument();
  });
});
