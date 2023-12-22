import { render, screen } from "@testing-library/react";
import Quarter from "../Quarter";

const quarter = {
  quarter: "QuarterName",
  classes: [{ name: "ClassName", catalog: "CLSS 101" }],
};

describe("common | edu-cards | Quarter", () => {
  it("renders as expected", () => {
    render(<Quarter quarter={quarter} />);

    expect(screen.getByText("QuarterName")).toBeInTheDocument();
    expect(screen.getByText("CLSS 101 -")).toBeInTheDocument();
    expect(screen.getByText("ClassName")).toBeInTheDocument();
  });

  it("renders as expected with multiple classes", () => {
    quarter.classes.push({ name: "Class 2", catalog: "CLSS 202" });
    render(<Quarter quarter={quarter} />);

    expect(screen.getByText("QuarterName")).toBeInTheDocument();

    expect(screen.getByText("CLSS 101 -")).toBeInTheDocument();
    expect(screen.getByText("ClassName")).toBeInTheDocument();

    expect(screen.getByText("CLSS 202 -")).toBeInTheDocument();
    expect(screen.getByText("Class 2")).toBeInTheDocument();
  });
});
