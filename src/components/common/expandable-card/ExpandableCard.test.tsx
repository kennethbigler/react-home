import { render, fireEvent, screen } from "@testing-library/react";
import ExpandableCard from ".";

describe("common | ExpandableCard", () => {
  describe("Basic props tests", () => {
    it("displays title as expected", () => {
      render(<ExpandableCard title="Title" />);
      expect(screen.getByText("Title")).toBeInTheDocument();
    });

    it("displays subtitle as expected", () => {
      render(<ExpandableCard subtitle="Subtitle" />);
      expect(screen.getByText("Subtitle")).toBeInTheDocument();
    });

    it("displays body expected", () => {
      render(<ExpandableCard>Body</ExpandableCard>);
      expect(screen.getByText("Body")).toBeInTheDocument();
    });

    describe("Title Text Colors", () => {
      it("displays title with black text when inverted", () => {
        render(<ExpandableCard title="Title" inverted />);
        expect(screen.getByText("Title")).toHaveStyle({ color: "rgb(0,0,0)" });
      });
    });

    describe("Title Background Colors", () => {
      it("displays title with white text by default", () => {
        render(<ExpandableCard title="Title" />);
        expect(
          screen.getByText("Title").parentElement?.parentElement?.parentNode,
        ).toHaveStyle({ backgroundColor: "rgb(21, 101, 192)" });
      });

      it("displays title with black text when inverted", () => {
        render(<ExpandableCard title="Title" backgroundColor="#333" />);
        expect(
          screen.getByText("Title").parentElement?.parentElement?.parentNode,
        ).toHaveStyle({ backgroundColor: "#333" });
      });
    });

    it("renders with all props combined", () => {
      render(
        <ExpandableCard
          title="Title"
          subtitle="Subtitle"
          backgroundColor="#333"
          inverted
        >
          Body
        </ExpandableCard>,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Subtitle")).toBeInTheDocument();
      expect(screen.getByText("Body")).toBeInTheDocument();
      expect(screen.getByText("Title")).toHaveStyle({ color: "rgb(0,0,0)" });
      expect(
        screen.getByText("Title").parentElement?.parentElement?.parentNode,
      ).toHaveStyle({ backgroundColor: "#333" });
    });
  });

  it("expands as expected with Title and SubTitle", () => {
    render(<ExpandableCard title="Title" subtitle="Subtitle" />);

    expect(screen.queryByText("Title")).toBeInTheDocument();
    expect(screen.queryByText("Subtitle")).toBeInTheDocument();
    expect(screen.queryByText("Body")).toBeNull();
    fireEvent.click(screen.getByText("Title"));
    expect(screen.queryByText("Body")).toBeNull();
    fireEvent.click(screen.getByText("Title"));
    expect(screen.queryByText("Body")).toBeNull();
  });
});
