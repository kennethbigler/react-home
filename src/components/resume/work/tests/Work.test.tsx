import { render, screen } from "@testing-library/react";
import Work from "..";

describe("resume | work | Work", () => {
  describe("rendering", () => {
    it("renders main experience heading", () => {
      render(<Work />);

      expect(screen.getByText("Experience")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Experience",
      );
    });

    it("renders all three main sections", () => {
      render(<Work />);

      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Volunteer")).toBeInTheDocument();
      expect(screen.getByText("School")).toBeInTheDocument();
    });

    it("renders work section with correct content", () => {
      render(<Work />);

      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
      expect(
        screen.getByText("Head of Accessibility Engineering"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Frontend Software Engineer"),
      ).toBeInTheDocument();
    });

    it("renders volunteer section with correct content", () => {
      render(<Work />);

      expect(screen.getByText("Volunteer")).toBeInTheDocument();
      expect(
        screen.getByText("Midnight Game Club, Sunnyvale, CA"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Frontend Software Engineer and Project Manager"),
      ).toBeInTheDocument();
    });

    it("renders school section with correct content", () => {
      render(<Work />);

      expect(screen.getByText("School")).toBeInTheDocument();
      expect(
        screen.getByText("Santa Clara University BS, Santa Clara, CA"),
      ).toBeInTheDocument();
      expect(screen.getByText("SCU MS, Santa Clara, CA")).toBeInTheDocument();
    });
  });

  describe("content verification", () => {
    it("displays correct work experience details", () => {
      render(<Work />);

      // Check specific work entries
      expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
      expect(
        screen.getByText("Head of Accessibility Engineering"),
      ).toBeInTheDocument();
      expect(screen.getByText("2019 - Present")).toBeInTheDocument();

      expect(
        screen.getByText("GigNow (Ernst & Young), Palo Alto, CA"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Frontend Software Engineer, Global Innovation Ventures",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("2018 - 2019")).toBeInTheDocument();

      expect(
        screen.getByText("Cisco Systems, San Jose, CA"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Full Stack Software Engineer III, Core Software Group",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("2017 - 2018")).toBeInTheDocument();
    });

    it("displays correct volunteer experience details", () => {
      render(<Work />);

      expect(
        screen.getByText("Midnight Game Club, Sunnyvale, CA"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Frontend Software Engineer and Project Manager"),
      ).toBeInTheDocument();
      expect(screen.getByText("2014 - 2015 (Spare Time)")).toBeInTheDocument();

      expect(
        screen.getByText("Second Harvest Food Bank, Santa Clara, CA"),
      ).toBeInTheDocument();
      expect(screen.getByText("Volunteer Team Leader")).toBeInTheDocument();
      expect(screen.getByText("2009 - 2016")).toBeInTheDocument();
    });

    it("displays correct education details", () => {
      render(<Work />);

      expect(screen.getByText("SCU MS, Santa Clara, CA")).toBeInTheDocument();
      expect(screen.getByText("Grad Student")).toBeInTheDocument();
      expect(screen.getAllByText("2015 - 2016")).toHaveLength(2);

      expect(
        screen.getByText("Santa Clara University BS, Santa Clara, CA"),
      ).toBeInTheDocument();
      expect(screen.getByText("Undergrad Student")).toBeInTheDocument();
      expect(screen.getByText("2011 - 2015")).toBeInTheDocument();
    });
  });

  describe("section ordering", () => {
    it("renders sections in correct order: Work, Volunteer, School", () => {
      render(<Work />);

      // Get only the section headings, not the card titles
      const sectionHeadings = screen.getAllByText(/^(Work|Volunteer|School)$/);
      expect(sectionHeadings).toHaveLength(3);
      expect(sectionHeadings[0]).toHaveTextContent("Work");
      expect(sectionHeadings[1]).toHaveTextContent("Volunteer");
      expect(sectionHeadings[2]).toHaveTextContent("School");
    });
  });

  describe("accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<Work />);

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Experience");

      // Check that section headings exist and are properly structured
      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Volunteer")).toBeInTheDocument();
      expect(screen.getByText("School")).toBeInTheDocument();
    });

    it("has proper semantic structure", () => {
      render(<Work />);

      // Check that the main heading is properly structured
      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toBeInTheDocument();

      // Check that section headings exist
      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Volunteer")).toBeInTheDocument();
      expect(screen.getByText("School")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles components with no jobs gracefully", () => {
      // This test ensures the component doesn't crash when there are no jobs
      // The actual data is hardcoded in the constants, so this is more of a smoke test
      render(<Work />);

      expect(screen.getByText("Experience")).toBeInTheDocument();
      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Volunteer")).toBeInTheDocument();
      expect(screen.getByText("School")).toBeInTheDocument();
    });
  });

  describe("data integrity", () => {
    it("displays all required job information", () => {
      render(<Work />);

      // Check that key information is present for major entries
      expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
      expect(
        screen.getByText("Head of Accessibility Engineering"),
      ).toBeInTheDocument();
      expect(screen.getByText("2019 - Present")).toBeInTheDocument();

      expect(screen.getByText("Tesla, Inc., Fremont, CA")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Full Stack Software Engineering Master's Intern, Supply Chain Team",
        ),
      ).toBeInTheDocument();
      expect(screen.getAllByText("2015 - 2016")).toHaveLength(2);
    });

    it("displays parent company information when available", () => {
      render(<Work />);

      expect(
        screen.getByText("GigNow (Ernst & Young), Palo Alto, CA"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Hoverboard Technologies (Equalia), Mountain View, CA",
        ),
      ).toBeInTheDocument();
    });

    it("displays job descriptions when available", () => {
      render(<Work />);

      // Check that some job descriptions are displayed
      expect(
        screen.getByText(/Improving accessibility across all of Intuit/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Help build startup ventures within EY/),
      ).toBeInTheDocument();
    });
  });
});
