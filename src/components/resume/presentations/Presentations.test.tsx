import { render, screen } from "@testing-library/react";
import Presentations from ".";

describe("resume | presentations | Presentations", () => {
  it("renders as expected", () => {
    render(<Presentations />);

    expect(screen.getByText("Presentations & Hackathons")).toBeInTheDocument();
    expect(screen.getByText("Hackathons")).toBeInTheDocument();
    expect(
      screen.getByText("GigNow - Hacking the Gig Economy Now"),
    ).toBeInTheDocument();
    expect(screen.getByText("Accenture Hackathon Games")).toBeInTheDocument();
  });
});
