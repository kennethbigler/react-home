import { render, screen } from "@testing-library/react";
import DataSsmlTest from "./DataSsmlTest";

describe("resume | DataSsmlTest", () => {
  it("renders the page heading", () => {
    render(<DataSsmlTest />);
    expect(
      screen.getByRole("heading", { name: /data-ssml test page/i }),
    ).toBeInTheDocument();
  });

  it("renders all section chips", () => {
    render(<DataSsmlTest />);
    expect(
      screen.getByText(/sub \/ alias — text substitution/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/say-as — character interpretation/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/phoneme — ipa pronunciation/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/break — timed pauses/i)).toBeInTheDocument();
    expect(screen.getByText(/prosody — speaking rate/i)).toBeInTheDocument();
    expect(
      screen.getByText(/combined — real-world science passage/i),
    ).toBeInTheDocument();
  });

  it("renders test cases with NVDA expected output labels", () => {
    render(<DataSsmlTest />);
    expect(
      screen.getAllByText(/nvda should say:/i).length,
    ).toBeGreaterThan(0);
  });

  it("renders data-ssml span elements", () => {
    const { container } = render(<DataSsmlTest />);
    const ssmlSpans = container.querySelectorAll("[data-ssml]");
    expect(ssmlSpans.length).toBeGreaterThan(0);
  });

  it("renders sub/alias test cases", () => {
    render(<DataSsmlTest />);
    expect(screen.getByText(/chemical element symbol/i)).toBeInTheDocument();
    expect(screen.getByText(/acronym expansion/i)).toBeInTheDocument();
  });

  it("renders phoneme test cases", () => {
    render(<DataSsmlTest />);
    expect(screen.getByText(/reading, pa/i)).toBeInTheDocument();
    expect(screen.getByText(/gif pronunciation/i)).toBeInTheDocument();
  });
});
