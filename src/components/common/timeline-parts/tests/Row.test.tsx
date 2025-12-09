import { render, screen } from "@testing-library/react";
import Row from "../Row";

const segments = [
  { title: "Title 1", body: "Body 1", width: 50 },
  { title: "Title 2", body: "Body 2", width: 50 },
];

describe("common | timeline-card | Row", () => {
  describe("basic props tests", () => {
    it("renders segments as expected", () => {
      render(<Row segments={segments} />);
      expect(screen.getByTitle("Title 1")).toBeInTheDocument();
      expect(screen.getByTitle("Title 2")).toBeInTheDocument();
    });
  });
});
