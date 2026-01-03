import { render, screen } from "@testing-library/react";
import YearMarker from "../YearMarker";

describe("common | timeline-card | YearMarker", () => {
  describe("basic props tests", () => {
    it("renders a year marker with all elements", () => {
      render(<YearMarker body="Body" width={50} />);
      expect(screen.getByTitle("Body")).toBeInTheDocument();
      expect(screen.getByTitle("Body")).toHaveStyle({ width: "50%" });
      expect(screen.getByTitle("year-marker")).toBeInTheDocument();
      expect(screen.getByText("Body")).toBeInTheDocument();

      expect(screen.queryByTitle("year")).toBeNull();
    });
    it("renders year gap if provided no body", () => {
      render(<YearMarker width={40} />);
      expect(screen.queryByTitle("year-marker")).toBeNull();
      expect(screen.getByTitle("year")).toBeInTheDocument();
      expect(screen.getByTitle("year")).toHaveStyle({ width: "40%" });
    });
  });
});
