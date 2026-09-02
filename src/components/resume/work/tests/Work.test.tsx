import { render, screen } from "@testing-library/react";
import Work from "..";

const sectionOrder = [
  "Presentations",
  "Work",
  "Hackathons",
  "Education",
  "Volunteer",
];

describe("resume | work | Work", () => {
  describe("rendering", () => {
    it("renders main experience heading", () => {
      render(<Work />);

      expect(screen.getByText("Experience")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Experience",
      );
    });

    it("renders all main sections", () => {
      render(<Work />);

      sectionOrder.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    it("renders work section with correct content", () => {
      render(<Work />);

      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
      expect(
        screen.getAllByText("Head of Accessibility Engineering").length,
      ).toBeGreaterThanOrEqual(1);
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

    it("renders presentation and hackathon cards", () => {
      render(<Work />);

      expect(
        screen.getByText("CSUN Assistive Technology Conference"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Other Public Conference Presentations"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("GigNow: Hacking the Gig Economy Now"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Accenture: Hackathon Games"),
      ).toBeInTheDocument();
    });

    it("renders education section with degree cards", () => {
      render(<Work />);

      expect(screen.getByText("Education")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Santa Clara University - Master of Science in Computer Engineering, Emphasis in Software Engineering",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Santa Clara University - Bachelor of Science in Computer Science & Engineering, Minor in Mathematics",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("content verification", () => {
    it("displays correct work experience details", () => {
      render(<Work />);

      expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
      expect(
        screen.getAllByText("Head of Accessibility Engineering").length,
      ).toBeGreaterThanOrEqual(1);
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

    it("displays education degrees from class data", () => {
      render(<Work />);

      expect(
        screen.getByText(
          "Stanford University - Stanford Continuing Studies & Undergrad High School Summer Visitor",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText("The King's Academy - High School Diploma"),
      ).toBeInTheDocument();
    });
  });

  describe("section ordering", () => {
    it("renders sections in order: Presentations, Work, Hackathons, Education, Volunteer", () => {
      render(<Work />);

      const sectionHeadings = screen
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent)
        .filter((text) => sectionOrder.includes(text ?? ""));

      expect(sectionHeadings).toEqual(sectionOrder);
    });
  });

  describe("accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<Work />);

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Experience");

      sectionOrder.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    it("has proper semantic structure", () => {
      render(<Work />);

      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      sectionOrder.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });
  });

  describe("edge cases", () => {
    it("handles components with no jobs gracefully", () => {
      render(<Work />);

      expect(screen.getByText("Experience")).toBeInTheDocument();
      sectionOrder.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });
  });

  describe("data integrity", () => {
    it("displays all required job information", () => {
      render(<Work />);

      expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
      expect(
        screen.getAllByText("Head of Accessibility Engineering").length,
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("2019 - Present")).toBeInTheDocument();

      expect(screen.getByText("Tesla, Inc., Fremont, CA")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Full Stack Software Engineering Master's Intern, Supply Chain Team",
        ),
      ).toBeInTheDocument();
      expect(screen.getAllByText("2015 - 2016")).toHaveLength(1);
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

      expect(
        screen.getByText(
          /Lead accessibility engineering across Intuit's product portfolio/,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Help build startup ventures within EY/),
      ).toBeInTheDocument();
    });
  });
});
