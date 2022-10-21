import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Education from "../Education";

describe("resume | education | Education", () => {
  it("renders as expected", async () => {
    const { container } = render(<Education />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    expect(screen.getByText("Hackathons & Education")).toBeInTheDocument();
    expect(screen.getByText("Hackathons")).toBeInTheDocument();
    expect(
      screen.getByText("GigNow - Hacking the Gig Economy Now")
    ).toBeInTheDocument();
    expect(screen.getByText("Accenture Hackathon Games")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Santa Clara University - Master of Science in Computer Engineering with an Emphasis in Software Engineering"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("GPA: 3.7 - Graduation: December 2016")
    ).toBeInTheDocument();
    expect(screen.getByText("Year 2")).toBeInTheDocument();
    expect(screen.getByText("Year 1 (Senior Year)")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Santa Clara University - Bachelor of Science in Computer Science & Engineering with a Minor in Mathematics"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("GPA: 3.7 - Graduation: June 2015")
    ).toBeInTheDocument();
    expect(screen.getAllByText("Senior Year")).toHaveLength(2);
    expect(screen.getAllByText("Junior Year")).toHaveLength(2);
    expect(screen.getAllByText("Sophomore Year")).toHaveLength(2);
    expect(screen.getAllByText("Freshman Year")).toHaveLength(2);

    expect(screen.getByText("Extracurriculars")).toBeInTheDocument();
    expect(screen.getByText("Honors Societies")).toBeInTheDocument();
    expect(screen.getByText("Clubs and Activities")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Stanford University - Stanford Continuing Studies & Undergrad High School Summer Visitor"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("GPA: 3.8")).toBeInTheDocument();
    expect(screen.getByText("Stanford Continuing Studies")).toBeInTheDocument();
    expect(
      screen.getByText("Undergrad High School Summer Visitor")
    ).toBeInTheDocument();

    expect(
      screen.getByText("The King's Academy - High School Diploma")
    ).toBeInTheDocument();
    expect(
      screen.getByText("GPA: 4.16 - Graduation: June 2011")
    ).toBeInTheDocument();

    expect(screen.queryByText("Undefined")).toBeNull();
    expect(screen.queryByText("undefined")).toBeNull();
  });
});
