import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScoreSummary from "./ScoreSummary";

describe("games | bridge | ScoreSummary", () => {
  it("renders Score heading", () => {
    render(
      <ScoreSummary
        winner="we"
        madeBid={true}
        aboveTheLine={40}
        belowTheLine={50}
      />,
    );

    expect(screen.getByText("Score")).toBeInTheDocument();
  });

  it("displays declarer win message when bid is made", () => {
    render(
      <ScoreSummary
        winner="we"
        madeBid={true}
        aboveTheLine={40}
        belowTheLine={50}
      />,
    );

    expect(screen.getByText("Declarer (we) won the hand!")).toBeInTheDocument();
  });

  it("displays declarer win message for 'they' when bid is made", () => {
    render(
      <ScoreSummary
        winner="they"
        madeBid={true}
        aboveTheLine={40}
        belowTheLine={50}
      />,
    );

    expect(
      screen.getByText("Declarer (they) won the hand!"),
    ).toBeInTheDocument();
  });

  it("displays defender success message when bid fails", () => {
    render(
      <ScoreSummary
        winner="they"
        madeBid={false}
        aboveTheLine={0}
        belowTheLine={100}
      />,
    );

    expect(
      screen.getByText("Defender (they) successfully defended!"),
    ).toBeInTheDocument();
  });

  it("displays defender success message for 'we' when bid fails", () => {
    render(
      <ScoreSummary
        winner="we"
        madeBid={false}
        aboveTheLine={0}
        belowTheLine={100}
      />,
    );

    expect(
      screen.getByText("Defender (we) successfully defended!"),
    ).toBeInTheDocument();
  });

  it("shows above the line score only when bid is made", () => {
    render(
      <ScoreSummary
        winner="we"
        madeBid={true}
        aboveTheLine={40}
        belowTheLine={50}
      />,
    );

    expect(screen.getByText("Above the line: 40")).toBeInTheDocument();
  });

  it("does not show above the line score when bid is not made", () => {
    render(
      <ScoreSummary
        winner="they"
        madeBid={false}
        aboveTheLine={0}
        belowTheLine={100}
      />,
    );

    expect(screen.queryByText(/Above the line/)).not.toBeInTheDocument();
  });

  it("always shows below the line score", () => {
    render(
      <ScoreSummary
        winner="we"
        madeBid={true}
        aboveTheLine={40}
        belowTheLine={150}
      />,
    );

    expect(screen.getByText("Below the line: 150")).toBeInTheDocument();
  });

  it("shows below the line score when bid fails", () => {
    render(
      <ScoreSummary
        winner="they"
        madeBid={false}
        aboveTheLine={0}
        belowTheLine={200}
      />,
    );

    expect(screen.getByText("Below the line: 200")).toBeInTheDocument();
  });

  it("displays correct scores for various values", () => {
    const { rerender } = render(
      <ScoreSummary
        winner="we"
        madeBid={true}
        aboveTheLine={60}
        belowTheLine={300}
      />,
    );

    expect(screen.getByText("Above the line: 60")).toBeInTheDocument();
    expect(screen.getByText("Below the line: 300")).toBeInTheDocument();

    rerender(
      <ScoreSummary
        winner="they"
        madeBid={true}
        aboveTheLine={100}
        belowTheLine={500}
      />,
    );

    expect(screen.getByText("Above the line: 100")).toBeInTheDocument();
    expect(screen.getByText("Below the line: 500")).toBeInTheDocument();
  });
});
