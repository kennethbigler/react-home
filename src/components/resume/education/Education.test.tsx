import { render, screen } from "@testing-library/react";
import Education from "./Education";

describe("resume | education | Education", () => {
  it("renders as expected", () => {
    render(<Education />);

    expect(screen.getByText("Education")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Santa Clara University - Master of Science in Computer Engineering, Emphasis in Software Engineering",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Year 2")).toBeInTheDocument();
    expect(screen.getByText("Year 1 (Senior Year)")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Santa Clara University - Bachelor of Science in Computer Science & Engineering, Minor in Mathematics",
      ),
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
        "Stanford University - Stanford Continuing Studies & Undergrad High School Summer Visitor",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Stanford Continuing Studies")).toBeInTheDocument();
    expect(
      screen.getByText("Undergrad High School Summer Visitor"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("The King's Academy - High School Diploma"),
    ).toBeInTheDocument();

    expect(screen.queryByText("Undefined")).toBeNull();
    expect(screen.queryByText("undefined")).toBeNull();
  });
});
