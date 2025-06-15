import { render, screen } from "@testing-library/react";
import CarCard from "../CarCard";
import { CarEntry } from "../../../../constants/cars";
import dateObj from "../../../../apis/DateHelper";

const demoCar: CarEntry = {
  color: "yellow",
  start: dateObj("2019-01"),
  end: dateObj(),
  car: "Corvette",
  title: "Chevrolet Corvette Z06 (2018)",
  inverted: true,
  src: "pathToImg",
  transmission: "Manual",
  horsepower: 650,
  MPG: 18,
  torque: 650,
  weight: 3524,
  zTo60: 3.1,
};

describe("resume | cars | CarCard", () => {
  it("renders as expected", () => {
    render(<CarCard car={demoCar} />);
    expect(screen.getByText(demoCar.title)).toBeInTheDocument();
    expect(
      screen.getByText(`Horsepower: ${demoCar.horsepower}`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Transmission: ${demoCar.transmission}`),
    ).toBeInTheDocument();
  });
});
