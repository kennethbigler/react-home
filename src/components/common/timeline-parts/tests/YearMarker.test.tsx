import { render, screen } from "@testing-library/react";
import YearMarker from "../YearMarker";

describe("common | timeline-card | YearMarker", () => {
  describe("basic props tests", () => {
    it("renders a year marker with label and tick", () => {
      const { container } = render(<YearMarker body="'25" width={0.3} />);

      expect(screen.getByText("'25")).toBeInTheDocument();
      expect(container.firstChild).toHaveStyle({
        flex: "0 0 0.3%",
        maxWidth: "0.3%",
      });
    });

    it("renders year gap when no body is provided", () => {
      const { container } = render(<YearMarker width={40} />);

      expect(screen.queryByText("'25")).not.toBeInTheDocument();
      expect(container.firstChild).toHaveStyle({
        flex: "0 0 40%",
        maxWidth: "40%",
      });
    });
  });
});
