import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Cars from "..";

describe("resume | cars | Cars", () => {
  it("renders as expected", async () => {
    render(<Cars />);

    await waitFor(() => {
      expect(screen.getAllByText("Ken's Cars")).toHaveLength(3);
    });
  });

  it("selects and deselects buttons", async () => {
    const { container } = render(<Cars />);

    await waitFor(() => {
      expect(screen.getByText("Hide Ken's Cars")).toBeInTheDocument();
    });

    expect(container.querySelector(".MuiButton-contained")).toBeNull();
    fireEvent.click(screen.getByText("Hide Ken's Cars"));

    await waitFor(() => {
      expect(
        container.querySelector(".MuiButton-contained"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Hide Ken's Cars"));

    await waitFor(() => {
      expect(container.querySelector(".MuiButton-contained")).toBeNull();
    });
  }, 90000);

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

  it("hides toggles car visibility", async () => {
    render(<Cars />);

    await waitFor(() => {
      expect(screen.getByTitle("Toyota Prius (2007)")).toBeInTheDocument();
    });

    expect(
      screen.getByTitle("Ford Bronco Badlands (2021)"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hide Family Cars"));

    await waitFor(() => {
      expect(screen.queryByTitle("Toyota Prius (2007)")).toBeNull();
    });

    expect(
      screen.getByTitle("Ford Bronco Badlands (2021)"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hide Ken's Cars"));

    await waitFor(() => {
      expect(screen.getByTitle("Toyota Prius (2007)")).toBeInTheDocument();
    });

    expect(screen.queryByTitle("Ford Bronco Badlands (2021)")).toBeNull();

    fireEvent.click(screen.getByText("Hide Family Cars"));

    await waitFor(() => {
      expect(screen.queryByTitle("Toyota Prius (2007)")).toBeNull();
    });

    expect(
      screen.getByTitle("Ford Bronco Badlands (2021)"),
    ).toBeInTheDocument();
  });

  it("automatically untoggles family when hiding Ken's cars while family is already hidden", () => {
    render(<Cars />);

    // First hide family cars
    fireEvent.click(screen.getByText("Hide Family Cars"));
    expect(screen.queryByTitle("Toyota Prius (2007)")).toBeNull();
    expect(
      screen.getByTitle("Ford Bronco Badlands (2021)"),
    ).toBeInTheDocument();

    // Then hide Ken's cars - should show family cars again
    fireEvent.click(screen.getByText("Hide Ken's Cars"));
    expect(screen.getByTitle("Toyota Prius (2007)")).toBeInTheDocument();
    expect(screen.queryByTitle("Ford Bronco Badlands (2021)")).toBeNull();
  });

  it("automatically untoggles Ken when hiding family cars while Ken is already hidden", () => {
    render(<Cars />);

    // First hide Ken's cars
    fireEvent.click(screen.getByText("Hide Ken's Cars"));
    expect(screen.getByTitle("Toyota Prius (2007)")).toBeInTheDocument();
    expect(screen.queryByTitle("Ford Bronco Badlands (2021)")).toBeNull();

    // Then hide family cars - should show Ken's cars again
    fireEvent.click(screen.getByText("Hide Family Cars"));
    expect(screen.queryByTitle("Toyota Prius (2007)")).toBeNull();
    expect(
      screen.getByTitle("Ford Bronco Badlands (2021)"),
    ).toBeInTheDocument();
  });
});
