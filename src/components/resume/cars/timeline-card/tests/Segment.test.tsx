import { render, screen } from "@testing-library/react";
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
});
