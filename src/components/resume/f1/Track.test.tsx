import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Track from "./Track";

const defaultProps = {
  circuitLen: 5.2,
  circuitName: "Monaco",
  expanded: "",
  firstGP: 1950,
  imgSrc: "/monaco.avif",
  numLaps: 78,
  raceLen: 260,
  onClick: () => () => {},
};

describe("resume | f1 | Track", () => {
  it("renders circuit name and track image", () => {
    render(<Track {...defaultProps} />);

    expect(screen.getByText("Monaco")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Monaco track layout" }),
    ).toBeInTheDocument();
  });

  it("renders circuit subname when provided", () => {
    render(<Track {...defaultProps} circuitSubName="Circuit de Monaco" />);

    expect(screen.getByText("Circuit de Monaco")).toBeInTheDocument();
  });

  it("calls onClick with circuit name when the track image button is clicked", () => {
    const onClick = vi.fn((circuitName: string) => {
      void circuitName;
      return () => {};
    });
    render(
      <Track
        {...defaultProps}
        onClick={onClick as (n: string) => () => void}
      />,
    );

    fireEvent.click(
      screen
        .getByRole("img", { name: "Monaco track layout" })
        .closest("button")!,
    );

    expect(onClick).toHaveBeenCalledWith("Monaco");
  });

  it("renders all content when skipped is true", () => {
    render(<Track {...defaultProps} skipped={true} />);

    expect(screen.getByText("Monaco")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Monaco track layout" }),
    ).toBeInTheDocument();
    expect(screen.getByText("First Grand Prix")).toBeInTheDocument();
    expect(screen.getByText("1950")).toBeInTheDocument();
  });

  it("renders when skipped is false", () => {
    render(<Track {...defaultProps} skipped={false} />);

    expect(screen.getByText("Monaco")).toBeInTheDocument();
  });

  it("renders when skipped is omitted", () => {
    render(<Track {...defaultProps} />);

    expect(screen.getByText("Monaco")).toBeInTheDocument();
  });
});
