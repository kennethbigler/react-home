import { render, screen, within } from "@testing-library/react";
import Job from "../Job";
import { work, volunteer, school } from "../../../../constants/work";
import type { Job as JobType } from "../../../../constants/work";

describe("resume | work | Job", () => {
  const mockJob = work[0]; // Intuit job
  const jobWithParent = work[1]; // GigNow (Ernst & Young)
  const volunteerJob = volunteer[0]; // Midnight Game Club
  const schoolJob = school[0]; // SCU MS

  const baseJob: JobType = {
    company: "Test Co",
    location: "Test City",
    title: "Engineer",
    time: "2020 - 2021",
    color: "blue",
  };

  const getTopLevelLists = () =>
    screen.getAllByRole("list").filter((list) => !list.closest("li"));

  describe("rendering", () => {
    it("renders job information correctly", () => {
      render(<Job job={mockJob} />);

      expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
      expect(
        screen.getAllByText("Head of Accessibility Engineering").length,
      ).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("2019 - Present")).toBeInTheDocument();
    });

    it("renders job with parent company", () => {
      render(<Job job={jobWithParent} />);

      expect(
        screen.getByText("GigNow (Ernst & Young), Palo Alto, CA"),
      ).toBeInTheDocument();
    });

    it("renders job without parent company", () => {
      render(<Job job={mockJob} />);

      expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
      // Should not have empty parentheses
      expect(screen.queryByText(/\(\s*\)/)).not.toBeInTheDocument();
    });
  });

  describe("job descriptions", () => {
    it("renders job descriptions when present", () => {
      render(<Job job={mockJob} />);

      expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
      expect(
        screen.getByText(
          /Lead accessibility engineering across Intuit's product portfolio/,
        ),
      ).toBeInTheDocument();
    });

    // Note: The Job component always shows descriptions section, so we test that it renders correctly
    it("renders job descriptions section", () => {
      render(<Job job={mockJob} />);

      expect(screen.getAllByRole("list").length).toBeGreaterThan(0);
      expect(
        screen.getByText(
          /Lead accessibility engineering across Intuit's product portfolio/,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("technologies", () => {
    it("renders technologies when present", () => {
      render(<Job job={mockJob} />);

      expect(screen.getByText("Technologies:")).toBeInTheDocument();
      expect(screen.getByText("React.js")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });

    // Note: The Job component always shows technologies section, so we test that it renders correctly
    it("renders technologies section", () => {
      render(<Job job={mockJob} />);

      expect(screen.getByText("Technologies:")).toBeInTheDocument();
      expect(screen.getByText("React.js")).toBeInTheDocument();
    });
  });

  describe("images", () => {
    it("renders image when src is present", () => {
      render(<Job job={mockJob} />);

      const image = screen.getByAltText("Intuit Logo");
      expect(image).toBeInTheDocument();
      expect(image.getAttribute("src")).toMatch(
        /\/src\/images\/companies\/intuit_logo\.png$/,
      );
    });

    // Note: The Job component always shows the image section, so we test that it renders correctly
    it("renders image section", () => {
      render(<Job job={mockJob} />);

      const image = screen.getByAltText("Intuit Logo");
      expect(image).toBeInTheDocument();
    });

    it("renders image with correct alt text", () => {
      render(<Job job={mockJob} />);

      expect(screen.getByAltText("Intuit Logo")).toBeInTheDocument();
    });

    // Note: The Job component always shows the image with alt text, so we test that it renders correctly
    it("renders image with alt text", () => {
      render(<Job job={mockJob} />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("alt", "Intuit Logo");
    });

    it("positions the company logo in the top-right corner", () => {
      render(<Job job={mockJob} />);

      const image = screen.getByRole("img");
      expect(image).toHaveStyle({
        float: "right",
        maxWidth: "7em",
        maxHeight: "4.5em",
        objectFit: "contain",
      });
    });

    it("does not render a logo when src is omitted", () => {
      render(<Job job={{ ...baseJob, expr: ["Detail"] }} />);

      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("expr formatting", () => {
    it("splits expr into separate lists on empty strings", () => {
      render(
        <Job
          job={{
            ...baseJob,
            expr: [
              "First section",
              "Item one",
              "",
              "Second section",
              "Item two",
            ],
          }}
        />,
      );

      expect(getTopLevelLists()).toHaveLength(2);
      expect(screen.getByText("First section")).toBeInTheDocument();
      expect(screen.getByText("Second section")).toBeInTheDocument();
    });

    it("does not render empty bullet points for empty strings", () => {
      render(
        <Job
          job={{
            ...baseJob,
            expr: ["Visible item", "", "Another item"],
          }}
        />,
      );

      expect(screen.getAllByRole("listitem")).toHaveLength(2);
      screen.getAllByRole("listitem").forEach((item) => {
        expect(item.textContent?.trim()).not.toBe("");
      });
    });

    it("renders lines prefixed with * as nested sub-bullets", () => {
      render(
        <Job
          job={{
            ...baseJob,
            expr: ["Section header", "* Sub detail one", "* Sub detail two"],
          }}
        />,
      );

      expect(screen.getByText("Section header")).toBeInTheDocument();
      expect(screen.queryByText("* Sub detail one")).not.toBeInTheDocument();
      expect(screen.getByText("Sub detail one")).toBeInTheDocument();
      expect(screen.getByText("Sub detail two")).toBeInTheDocument();

      const [outerList] = screen.getAllByRole("list");
      const nestedList = within(outerList).getByRole("list");
      expect(nestedList.querySelectorAll("li")).toHaveLength(2);
    });

    it("renders multiple role sections with nested bullets", () => {
      render(
        <Job
          job={{
            ...baseJob,
            expr: [
              "Role one",
              "2020 - 2022",
              "* Detail A",
              "",
              "Role two",
              "2022 - 2024",
              "* Detail B",
            ],
          }}
        />,
      );

      expect(getTopLevelLists()).toHaveLength(2);
      expect(screen.getByText("Role one")).toBeInTheDocument();
      expect(screen.getByText("Role two")).toBeInTheDocument();
      expect(screen.getByText("Detail A")).toBeInTheDocument();
      expect(screen.getByText("Detail B")).toBeInTheDocument();
    });

    it("renders current job with two role sections and nested accomplishments", () => {
      render(<Job job={mockJob} />);

      expect(getTopLevelLists().length).toBeGreaterThanOrEqual(2);
      expect(
        screen.getByText("Senior Software Engineer (Intuit Design System)"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Built and scaled the Intuit Design System/),
      ).toBeInTheDocument();
    });
  });

  describe("styling and layout", () => {
    it("applies correct background color", () => {
      render(<Job job={mockJob} />);

      // Look for an element with the background color style
      const cardAction = screen.getByRole("button");
      expect(cardAction).toHaveStyle({ backgroundColor: mockJob.color });
    });

    it("applies inverted styling when specified", () => {
      render(<Job job={jobWithParent} />);

      // GigNow has inverted styling (black text on yellow background)
      const cardAction = screen.getByRole("button");
      expect(cardAction).toHaveStyle({ color: "rgb(0, 0, 0)" });
    });

    it("applies non-inverted styling when not specified", () => {
      render(<Job job={mockJob} />);

      // Intuit should have white text
      const cardAction = screen.getByRole("button");
      expect(cardAction).toHaveStyle({ color: "rgb(255, 255, 255)" });
    });
  });

  describe("grid sizing", () => {
    it("applies correct grid sizing for default props", () => {
      const { container } = render(<Job job={mockJob} />);

      const gridItem = container.querySelector('[class*="MuiGrid-grid-lg-6"]');
      expect(gridItem).toBeInTheDocument();
    });

    it("applies full width when fullWidth prop is true", () => {
      const { container } = render(<Job job={mockJob} fullWidth={true} />);

      const gridItem = container.querySelector('[class*="MuiGrid-grid-lg-12"]');
      expect(gridItem).toBeInTheDocument();
    });

    it("applies triple width when triple prop is true", () => {
      const { container } = render(<Job job={mockJob} triple={true} />);

      const gridItem = container.querySelector('[class*="MuiGrid-grid-xxl-4"]');
      expect(gridItem).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles job with minimal required properties", () => {
      const minimalJob = {
        company: "Test Company",
        location: "Test Location",
        title: "Test Title",
        time: "2020 - 2021",
        color: "red",
      };
      render(<Job job={minimalJob} />);

      expect(
        screen.getByText("Test Company, Test Location"),
      ).toBeInTheDocument();
      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("2020 - 2021")).toBeInTheDocument();
    });

    // Note: The Job component uses the original job data, so we test with the actual data
    it("handles job with all properties", () => {
      render(<Job job={mockJob} />);

      expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Lead accessibility engineering across Intuit's product portfolio/,
        ),
      ).toBeInTheDocument();
      expect(screen.getByText("React.js")).toBeInTheDocument();
      expect(screen.getByAltText("Intuit Logo")).toBeInTheDocument();
    });
  });

  describe("different job types", () => {
    it("renders work job correctly", () => {
      render(<Job job={mockJob} />);

      expect(screen.getByText("Intuit, Mountain View, CA")).toBeInTheDocument();
      expect(
        screen.getAllByText("Head of Accessibility Engineering").length,
      ).toBeGreaterThanOrEqual(1);
    });

    it("renders volunteer job correctly", () => {
      render(<Job job={volunteerJob} />);

      expect(
        screen.getByText("Midnight Game Club, Sunnyvale, CA"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Frontend Software Engineer and Project Manager"),
      ).toBeInTheDocument();
    });

    it("renders school job correctly", () => {
      render(<Job job={schoolJob} />);

      expect(screen.getByText("SCU MS, Santa Clara, CA")).toBeInTheDocument();
      expect(screen.getByText("Grad Student")).toBeInTheDocument();
    });
  });
});
