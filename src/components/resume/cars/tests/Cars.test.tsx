import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Cars from "../Cars";
import cars from "../../../../constants/cars";

const demoCar = cars[cars.length - 3];

const { ResizeObserver } = window;

beforeEach(() => {
  // @ts-expect-error: TODO: overwriting to get rid of recharts error, remove later
  delete window.ResizeObserver;
  window.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  vi.restoreAllMocks();
});

describe("resume | cars | Cars", () => {
  it("renders as expected", () => {
    const { container } = render(<Cars />);

    expect(screen.getAllByText("Ken's Cars")).toHaveLength(2);
    expect(screen.getByText(`(${demoCar.owned})`)).toBeInTheDocument();
    expect(screen.getAllByText(demoCar.title)).toHaveLength(2);
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
      screen.getByTitle("Ford Bronco Badlands (2021)")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Ken's"));
    expect(screen.queryByTitle("Ford Bronco Badlands (2021)")).toBeNull();
  });

  it("hides all cars", () => {
    render(<Cars />);

    expect(screen.getByTitle("Toyota Prius (2007)")).toBeInTheDocument();
    expect(
      screen.getByTitle("Ford Bronco Badlands (2021)")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Family's"));
    expect(screen.queryByTitle("Toyota Prius (2007)")).toBeNull();
    expect(
      screen.getByTitle("Ford Bronco Badlands (2021)")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Hide Ken's"));
    expect(screen.queryByTitle("Toyota Prius (2007)")).toBeNull();
    expect(screen.queryByTitle("Ford Bronco Badlands (2021)")).toBeNull();
  });
});
