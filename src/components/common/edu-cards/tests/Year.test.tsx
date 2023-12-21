import { render, screen } from "@testing-library/react";
import Year from "../Year";

const year = {
  year: "YearName",
  quarters: [
    {
      quarter: "QuarterName",
      classes: [{ name: "ClassName", catalog: "CLSS 101" }],
    },
  ],
};

describe("common | edu-cards | Year", () => {
  it("renders as expected", () => {
    render(<Year year={year} len={1} />);

    expect(screen.getByText("YearName")).toBeInTheDocument();
    expect(screen.getByText("QuarterName")).toBeInTheDocument();
    expect(screen.getByText("CLSS 101 -")).toBeInTheDocument();
    expect(screen.getByText("ClassName")).toBeInTheDocument();
  });

  it("renders as expected with multiple quarters", () => {
    year.quarters.push({
      quarter: "Quarter 2",
      classes: [{ name: "Class 2", catalog: "CLSS 202" }],
    });
    render(<Year year={year} len={1} />);

    expect(screen.getByText("YearName")).toBeInTheDocument();

    expect(screen.getByText("QuarterName")).toBeInTheDocument();
    expect(screen.getByText("CLSS 101 -")).toBeInTheDocument();
    expect(screen.getByText("ClassName")).toBeInTheDocument();

    expect(screen.getByText("Quarter 2")).toBeInTheDocument();
    expect(screen.getByText("CLSS 202 -")).toBeInTheDocument();
    expect(screen.getByText("Class 2")).toBeInTheDocument();
  });
});
