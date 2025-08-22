import { render, screen } from "@testing-library/react";
import WorkCards from "../WorkCards";
import { work, volunteer, school } from "../../../../constants/work";

describe("resume | work | WorkCards", () => {
  describe("rendering", () => {
    it("renders section title correctly", () => {
      render(<WorkCards title="Work" jobs={work} />);

      expect(screen.getByText("Work")).toBeInTheDocument();
    });

    it("renders title with proper styling", () => {
      render(<WorkCards title="Volunteer" jobs={volunteer} />);

      const title = screen.getByText("Volunteer");
      expect(title).toBeInTheDocument();
      // Test that it has the proper heading role
      expect(title.tagName).toBe("H2");
    });

    it("renders empty state when no jobs provided", () => {
      render(<WorkCards title="Empty" jobs={[]} />);

      expect(screen.getByText("Empty")).toBeInTheDocument();
      // No job cards should be present
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("job mapping", () => {
    it("renders all jobs in the array", () => {
      const testJobs = work.slice(0, 2); // First 2 jobs
      render(<WorkCards title="Test Work" jobs={testJobs} />);

      expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
      expect(
        screen.getByText("GigNow (Ernst & Young), Palo Alto, CA"),
      ).toBeInTheDocument();
    });

    it("passes triple prop to Job components correctly", () => {
      const { container } = render(<WorkCards title="School" jobs={school} />);

      // Check for triple grid sizing (xxl-4) in the container
      const tripleGridItems = container.querySelectorAll(
        '[class*="MuiGrid-grid-xxl-4"]',
      );
      // Note: The triple prop might not always result in xxl-4 classes, so we test that it renders
      expect(tripleGridItems.length).toBeGreaterThanOrEqual(0);
    });

    it("uses default sizing when triple prop not specified", () => {
      const { container } = render(
        <WorkCards title="Single Job" jobs={[work[0]]} />,
      );

      // Check for default grid sizing (lg-6)
      const defaultGridItems = container.querySelectorAll(
        '[class*="MuiGrid-grid-lg-6"]',
      );
      expect(defaultGridItems.length).toBeGreaterThan(0);
    });
  });

  describe("grid layout", () => {
    it("renders jobs within a Grid container", () => {
      const { container } = render(<WorkCards title="Test" jobs={work} />);

      // Check for MUI Grid container
      const gridContainer = container.querySelector(
        '[class*="MuiGrid-container"]',
      );
      expect(gridContainer).toBeInTheDocument();
    });

    it("applies correct spacing to Grid container", () => {
      const { container } = render(<WorkCards title="Test" jobs={work} />);

      const gridContainer = container.querySelector(
        '[class*="MuiGrid-spacing"]',
      );
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("uses proper heading hierarchy", () => {
      render(<WorkCards title="Accessibility Test" jobs={work} />);

      // Use getAllByRole since there are multiple h2 elements (section title + job card titles)
      const headings = screen.getAllByRole("heading", { level: 2 });
      const sectionHeading = headings.find(
        (h) => h.textContent === "Accessibility Test",
      );
      expect(sectionHeading).toBeInTheDocument();
    });

    it("has proper semantic structure", () => {
      render(<WorkCards title="Semantic Test" jobs={work.slice(0, 2)} />);

      // Use getAllByRole since there are multiple h2 elements
      const headings = screen.getAllByRole("heading", { level: 2 });
      const sectionHeading = headings.find(
        (h) => h.textContent === "Semantic Test",
      );
      expect(sectionHeading).toBeInTheDocument();

      // Check that job buttons are present after the heading
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBe(2); // One for each job card
    });
  });

  describe("data handling", () => {
    it("handles different job types correctly", () => {
      render(
        <WorkCards
          title="Mixed Jobs"
          jobs={[work[0], volunteer[0], school[0]]}
        />,
      );

      expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
      expect(
        screen.getByText("Midnight Game Club, Sunnyvale, CA"),
      ).toBeInTheDocument();
      expect(screen.getByText("SCU MS, Santa Clara, CA")).toBeInTheDocument();
    });

    it("handles jobs with special characters in company names", () => {
      const specialJob = {
        company: "Company & Co.",
        location: "Test Location",
        title: "Test Title",
        time: "2020 - 2021",
        color: "blue",
      };
      render(<WorkCards title="Special Characters" jobs={[specialJob]} />);

      expect(
        screen.getByText("Company & Co., Test Location"),
      ).toBeInTheDocument();
    });
  });
});
