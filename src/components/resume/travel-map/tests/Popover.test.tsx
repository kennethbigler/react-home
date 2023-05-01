import { render, screen } from "@testing-library/react";
import Popover from "../Popover";

const x = 3;
const y = 42;

describe("resume | travel-map | Popover", () => {
  it("renders as expected", () => {
    render(<Popover x={x} y={y} hide={false} content="hello world" />);

    expect(screen.getByText("hello world")).toBeInTheDocument();
    const popoverStyles = screen.getByText("hello world").style;
    expect(popoverStyles.left).toEqual(`${x + 2}px`);
    expect(popoverStyles.top).toEqual(`${y - 35}px`);
    expect(popoverStyles.display).toEqual("block");
  });

  it("hides as expected", () => {
    render(<Popover hide x={x} y={y} content="hello world" />);

    expect(screen.getByText("hello world")).toBeInTheDocument();
    const popoverStyles = screen.getByText("hello world").style;
    expect(popoverStyles.left).toEqual(`${x + 2}px`);
    expect(popoverStyles.top).toEqual(`${y - 35}px`);
    expect(popoverStyles.display).toEqual("none");
  });
});
