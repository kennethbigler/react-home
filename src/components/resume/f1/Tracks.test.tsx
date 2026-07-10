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
      screen.getByText("Circuit de Spa-Francorchamps, Belgium"),
    ).toBeInTheDocument();
  });

  it("renders a track marked as skipped with its circuit name visible", () => {
    render(<Tracks />);

    expect(
      screen.getByText("Bahrain International Circuit, Sakhir"),
    ).toBeInTheDocument();
  });
});
