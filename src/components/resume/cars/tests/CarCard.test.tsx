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

  it("uses owner-specific dates for Ken's ownership window", () => {
    render(
      <CarCard
        car={{
          ...demoCar,
          start: dateObj("2016-01"),
          end: dateObj("2024-01"),
          kStart: dateObj("2019-01"),
          fStart: dateObj("2021-01"),
        }}
        isK
      />,
    );

    expect(screen.getByText("(2019 - 2021)")).toBeInTheDocument();
  });

  it("uses family-specific dates for the non-Ken ownership window", () => {
    render(
      <CarCard
        car={{
          ...demoCar,
          start: dateObj("2016-01"),
          end: dateObj("2024-01"),
          kStart: dateObj("2019-01"),
          fStart: dateObj("2021-01"),
        }}
      />,
    );

    expect(screen.getByText("(2021 - 2019)")).toBeInTheDocument();
  });
});
