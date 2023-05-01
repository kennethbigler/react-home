import { render, screen, fireEvent } from "@testing-library/react";
import Summary from "../Summary";

describe("resume | summary | Summary", () => {
  it("renders as expected", () => {
    render(<Summary />);

    expect(
      screen.getByText("Accessibility Engineering Leader, Intuit")
    ).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Mountain View, CA")).toBeInTheDocument();

    expect(screen.getByText("Timeline")).toBeInTheDocument();
    expect(screen.getByText("Intuit")).toBeInTheDocument();

    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Summary of Skills:")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Developing useful, multi-platform software tools and creating user interfaces"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Technologies:")).toBeInTheDocument();
    expect(screen.getByText("React.js")).toBeInTheDocument();
    expect(screen.getByText("Skills:")).toBeInTheDocument();
    expect(screen.getByText("Leadership")).toBeInTheDocument();

    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(
      screen.getAllByText("Santa Clara University, Santa Clara, CA")
    ).toHaveLength(2);
    expect(
      screen.getByText("Master of Science in Computer Engineering")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Bachelor of Science in Computer Science & Engineering")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Stanford University, Stanford, CA")
    ).toBeInTheDocument();
    expect(
      screen.getByText("The King's Academy, Sunnyvale, CA")
    ).toBeInTheDocument();
  });

  it("toggles display on header click", () => {
    const { container } = render(<Summary />);

    expect(
      container.querySelectorAll(".MuiCollapse-root.MuiCollapse-entered")
    ).toHaveLength(4);
    fireEvent.click(screen.getByText("Education"));
    expect(
      container.querySelectorAll(".MuiCollapse-root.MuiCollapse-entered")
    ).toHaveLength(3);
  });
});
