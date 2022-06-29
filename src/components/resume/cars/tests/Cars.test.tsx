import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Cars from "../Cars";
import cars from "../../../../constants/cars";

const demoCar = cars[1];

const { ResizeObserver } = window;

beforeEach(() => {
  // @ts-expect-error: TODO: overwriting to get rid of recharts error, remove later
  delete window.ResizeObserver;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  jest.restoreAllMocks();
});

describe("resume | cars | Cars", () => {
  it("renders as expected", () => {
    const { container } = render(<Cars />);

    expect(screen.getAllByText("Ken's Cars")).toHaveLength(2);
    expect(screen.getAllByText(`(${demoCar.owned})`)).toHaveLength(2);
    expect(screen.getByText(demoCar.title)).toBeInTheDocument();
    expect(
      screen.getByText(`Horsepower: ${demoCar.horsepower}`)
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(`Transmission: ${demoCar.transmission}`)[0]
    ).toBeInTheDocument();
    expect(screen.getByText(demoCar.story)).toBeInTheDocument();
    expect(screen.getByAltText(demoCar.title)).toBeInTheDocument();
    expect(screen.getByAltText(demoCar.title)).toHaveAttribute(
      "src",
      demoCar.src
    );

    expect(
      container.querySelector(".recharts-responsive-container")
    ).toBeInTheDocument();
  });

  it("selects and deselects buttons", () => {
    const { container } = render(<Cars />);

    expect(container.querySelector(".MuiButton-contained")).toBeNull();
    fireEvent.click(screen.getByText("Horsepower"));
    expect(container.querySelector(".MuiButton-contained")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Horsepower"));
    expect(container.querySelector(".MuiButton-contained")).toBeNull();
  });

  it("re-enables animations", () => {
    const { container } = render(<Cars />);

    fireEvent.click(screen.getByText("MPG"));
    fireEvent.click(screen.getByText("Horsepower"));
    fireEvent.click(screen.getByText("Weight"));
    fireEvent.click(screen.getByText("Power-to-Weight"));

    expect(
      container.querySelector(".recharts-responsive-container")
    ).toBeInTheDocument();
  });

  it("hides family cars", () => {
    render(<Cars />);

    expect(screen.getByTitle("Toyota Prius (2007)")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Family's"));
    expect(screen.queryByTitle("Toyota Prius (2007)")).toBeNull();
  });

  it("hides kens cars", () => {
    render(<Cars />);

    expect(
      screen.getByTitle("Chevrolet Corvette Z06 (2018)")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Ken's"));
    expect(screen.queryByTitle("Chevrolet Corvette Z06 (2018)")).toBeNull();
  });

  it("hides all cars", () => {
    render(<Cars />);

    expect(screen.getByTitle("Toyota Prius (2007)")).toBeInTheDocument();
    expect(
      screen.getByTitle("Chevrolet Corvette Z06 (2018)")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Family's"));
    expect(screen.queryByTitle("Toyota Prius (2007)")).toBeNull();
    expect(
      screen.getByTitle("Chevrolet Corvette Z06 (2018)")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Ken's"));
    expect(screen.queryByTitle("Toyota Prius (2007)")).toBeNull();
    expect(screen.queryByTitle("Chevrolet Corvette Z06 (2018)")).toBeNull();
  });
});
