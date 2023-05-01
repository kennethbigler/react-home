import { render, screen } from "@testing-library/react";
import CarCard, { Car } from "../CarCard";

const demoCar: Car = {
  owned: "2020",
  story: "Story",
  src: "pathToImg",
  title: "2018 Chevrolet Corvette",
  transmission: "Manual",
  horsepower: 650,
};

describe("resume | cars | CarCard", () => {
  it("renders as expected", () => {
    render(<CarCard car={demoCar} />);
    expect(screen.getByText(`(${demoCar.owned})`)).toBeInTheDocument();
    expect(screen.getByText(demoCar.title)).toBeInTheDocument();
    expect(
      screen.getByText(`Horsepower: ${demoCar.horsepower}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Transmission: ${demoCar.transmission}`)
    ).toBeInTheDocument();
    expect(screen.getByText(demoCar.story)).toBeInTheDocument();
    expect(screen.getByAltText(demoCar.title)).toBeInTheDocument();
    expect(screen.getByAltText(demoCar.title)).toHaveAttribute(
      "src",
      demoCar.src
    );
  });
});
