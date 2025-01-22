import { render, screen, fireEvent } from "@testing-library/react";
import Cars from "..";
import cars from "../../../../constants/cars";

const demoCar = cars[cars.length - 4];

describe("resume | cars | Cars", () => {
  it("renders as expected", () => {
    render(<Cars />);

    expect(screen.getAllByText("Ken's Cars")).toHaveLength(3);
    expect(screen.getByText(`(${demoCar.owned})`)).toBeInTheDocument();
    expect(screen.getAllByText(demoCar.title)).toHaveLength(2);
    expect(
      screen.getByText(`Horsepower: ${demoCar.horsepower}`),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(`Transmission: ${demoCar.transmission}`)[0],
    ).toBeInTheDocument();
    expect(screen.getByText(demoCar.story)).toBeInTheDocument();
  });

  it("selects and deselects buttons", () => {
    const { container } = render(<Cars />);

    expect(container.querySelector(".MuiButton-contained")).toBeNull();
    fireEvent.click(screen.getByText("Hide Ken's Cars"));
    expect(container.querySelector(".MuiButton-contained")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Ken's Cars"));
    expect(container.querySelector(".MuiButton-contained")).toBeNull();
  });

  it("hides family cars", () => {
    render(<Cars />);

    expect(screen.getByTitle("Toyota Prius (2007)")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Family Cars"));
    expect(screen.queryByTitle("Toyota Prius (2007)")).toBeNull();
  });

  it("hides kens cars", () => {
    render(<Cars />);

    expect(
      screen.getByTitle("Ford Bronco Badlands (2021)"),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Ken's Cars"));
    expect(screen.queryByTitle("Ford Bronco Badlands (2021)")).toBeNull();
  });

  it("hides toggles car visibility", () => {
    render(<Cars />);

    expect(screen.getByTitle("Toyota Prius (2007)")).toBeInTheDocument();
    expect(
      screen.getByTitle("Ford Bronco Badlands (2021)"),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Family Cars"));
    expect(screen.queryByTitle("Toyota Prius (2007)")).toBeNull();
    expect(
      screen.getByTitle("Ford Bronco Badlands (2021)"),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Ken's Cars"));
    expect(screen.getByTitle("Toyota Prius (2007)")).toBeInTheDocument();
    expect(screen.queryByTitle("Ford Bronco Badlands (2021)")).toBeNull();
    fireEvent.click(screen.getByText("Hide Family Cars"));
    expect(screen.queryByTitle("Toyota Prius (2007)")).toBeNull();
    expect(
      screen.getByTitle("Ford Bronco Badlands (2021)"),
    ).toBeInTheDocument();
  });
});
