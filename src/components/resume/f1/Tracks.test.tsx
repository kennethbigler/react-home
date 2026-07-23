import { render, screen } from "@testing-library/react";
import Tracks from "./Tracks";

describe("resume | f1 | Tracks", () => {
  it("renders the current and past track sections", () => {
    render(<Tracks />);

    expect(screen.getByText("2026 Tracks")).toBeInTheDocument();
    expect(screen.getByText("Past Tracks")).toBeInTheDocument();
  });

  it("renders a track marked as next with its circuit name visible", () => {
    render(<Tracks />);

    expect(
      screen.getByRole("button", {
        name: /Hungaroring, Budapest, Hungary circuit details, next race/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Circuit de Spa-Francorchamps, Belgium"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /Circuit de Spa-Francorchamps, Belgium circuit details, next race/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("renders a track marked as skipped with its circuit name visible", () => {
    render(<Tracks />);

    expect(
      screen.getByRole("button", {
        name: /Bahrain International Circuit, Sakhir circuit details, skipped/i,
      }),
    ).toBeInTheDocument();
  });
});
