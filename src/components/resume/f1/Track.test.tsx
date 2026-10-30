import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import dateObj from "@/apis/DateHelper";
import Track from "./Track";

const defaultProps = {
  circuitLen: 5.2,
  circuitName: "Monaco",
  expanded: "",
  firstGP: 1950,
  imgSrc: "/monaco.avif",
  numLaps: 78,
  raceLen: 260,
  onToggle: () => {},
};

const datedProps = { ...defaultProps, date: dateObj("2026-06-07") };

describe("resume | f1 | Track", () => {
  it("renders circuit name and track image", () => {
    render(<Track {...datedProps} />);

    expect(screen.getByText("Monaco")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Monaco track layout" }),
    ).toBeInTheDocument();
  });

  it("renders circuit subname when provided", () => {
    render(<Track {...datedProps} circuitSubName="Circuit de Monaco" />);

    expect(screen.getByText("Circuit de Monaco")).toBeInTheDocument();
  });

  it("calls onToggle with circuit name when the track image button is clicked", () => {
    const onToggle = vi.fn();
    render(<Track {...datedProps} onToggle={onToggle} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Expand Monaco circuit details" }),
    );

    expect(onToggle).toHaveBeenCalledWith("Monaco");
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

  it("renders when skipped is omitted", () => {
    render(<Track {...datedProps} />);

    expect(screen.getByText("Monaco")).toBeInTheDocument();
  });

  it("renders all content when next is true", () => {
    render(
      <Track {...defaultProps} next={true} date={dateObj("2026-07-26")} />,
    );

    expect(screen.getByText("Monaco")).toBeInTheDocument();
    expect(screen.getByText("July 26, 2026")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Monaco track layout" }),
    ).toBeInTheDocument();
    expect(screen.getByText("First Grand Prix")).toBeInTheDocument();
    expect(screen.getByText("1950")).toBeInTheDocument();
  });

  it("renders when next is false", () => {
    render(<Track {...datedProps} next={false} />);

    expect(screen.getByText("Monaco")).toBeInTheDocument();
  });

  it("renders when next is omitted", () => {
    render(<Track {...datedProps} />);

    expect(screen.getByText("Monaco")).toBeInTheDocument();
  });
});
