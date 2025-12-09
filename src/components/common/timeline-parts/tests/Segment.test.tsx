import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Segment from "../Segment";

describe("common | timeline-card | Segment", () => {
  describe("basic props tests", () => {
    it("with all props", () => {
      render(<Segment color="#FFF" body="Body" title="Title" width={100} />);
      // color
      expect(screen.getByTitle("Title")).toHaveStyle({
        backgroundColor: "rgb(255, 255, 255)",
      });
      // body
      expect(screen.getByText("Body")).toBeInTheDocument();
      // title
      expect(screen.getByTitle("Title")).toBeInTheDocument();
      // width
      expect(screen.getByTitle("Title")).toHaveStyle({ width: "100%" });
      // inverted
      expect(screen.getByTitle("Title")).toHaveStyle({
        color: "rgb(250, 250, 250)",
      });
    });

    it("with color, with body", () => {
      render(<Segment color="#FFF" body="Body" title="Title" width={100} />);
      // color
      expect(screen.getByTitle("Title")).toHaveStyle({
        backgroundColor: "rgb(255, 255, 255)",
      });
      // body
      expect(screen.getByText("Body")).toBeInTheDocument();
      // title
      expect(screen.getByTitle("Title")).toBeInTheDocument();
      // width
      expect(screen.getByTitle("Title")).toHaveStyle({ width: "100%" });
      // inverted
      expect(screen.getByTitle("Title")).toHaveStyle({
        color: "rgb(250, 250, 250)",
      });
    });

    it("with body", () => {
      render(<Segment body="Body" title="Title" width={100} />);
      // body
      expect(screen.getByText("Body")).toBeInTheDocument();
      // title
      expect(screen.getByTitle("Title")).toBeInTheDocument();
      // width
      expect(screen.getByTitle("Title")).toHaveStyle({ width: "100%" });
      // inverted
      expect(screen.getByTitle("Title")).toHaveStyle({
        color: "rgb(250, 250, 250)",
      });
    });

    it("with inverted being false", () => {
      render(
        <Segment body="Body" title="Title" width={100} inverted={false} />,
      );
      // title
      expect(screen.getByTitle("Title")).toBeInTheDocument();
      // width
      expect(screen.getByTitle("Title")).toHaveStyle({ width: "100%" });
      // inverted
      expect(screen.getByTitle("Title")).toHaveStyle({
        color: "rgb(250, 250, 250)",
      });
    });

    it("with inverted being true", () => {
      render(<Segment body="Body" title="Title" width={100} inverted />);
      // title
      expect(screen.getByTitle("Title")).toBeInTheDocument();
      // width
      expect(screen.getByTitle("Title")).toHaveStyle({ width: "100%" });
      // inverted
      expect(screen.getByTitle("Title")).toHaveStyle({ color: "rgb(0, 0, 0)" });
    });
  });

  describe("empty segment (no body)", () => {
    it("renders as a div without body text", () => {
      const { container } = render(<Segment width={50} />);
      // should render a div, not a button
      expect(container.querySelector("button")).not.toBeInTheDocument();
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("applies correct width style", () => {
      const { container } = render(<Segment width={25} />);
      const innerDiv = container.querySelector("div > div");
      expect(innerDiv).toHaveStyle({ width: "25%" });
    });
  });

  describe("onClick functionality", () => {
    it("calls onClick with title when clicked", () => {
      const handleClick = vi.fn();
      render(
        <Segment
          body="Clickable"
          title="ClickTitle"
          width={100}
          onClick={handleClick}
        />,
      );
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledWith("ClickTitle");
    });

    it("calls onClick with empty string when title is undefined", () => {
      const handleClick = vi.fn();
      render(<Segment body="Clickable" width={100} onClick={handleClick} />);
      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledWith("");
    });

    it("uses default onClick when not provided", () => {
      render(<Segment body="NoClick" title="Title" width={100} />);
      // should not throw when clicking
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByText("NoClick")).toBeInTheDocument();
    });
  });
});
