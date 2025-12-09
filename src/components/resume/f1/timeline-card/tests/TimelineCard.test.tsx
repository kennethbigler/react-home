import { render, screen } from "@testing-library/react";
import TimelineCard from "../TimelineCard";

import dateObj from "../../../../../apis/DateHelper";
import { ContractData } from "../../../../../constants/f1";

const data: ContractData[] = [
  {
    color: "red",
    team: "Red Bull",
    start: dateObj("2019-06"),
    end: dateObj("2019-09"),
  },
  {
    color: "blue",
    team: "McLaren",
    start: dateObj("2019-07"),
    end: dateObj("2020-02"),
    inverted: true,
  },
  {
    color: "blue",
    team: "Mercedes",
    start: dateObj("2019-08"),
    end: dateObj("2020-02"),
  },
  {
    color: "blue",
    team: "Ferrari",
    start: dateObj("2019-09"),
    end: dateObj("2020-02"),
    inverted: true,
  },
];

describe("resume | f1 | timeline-card | TimelineCard", () => {
  it("renders as expected", () => {
    render(<TimelineCard data={data} />);

    // verify ExpandableCard
    expect(screen.getByText("F1 Team History")).toBeInTheDocument();

    // verify Timeline
    expect(screen.getAllByTitle("year")).not.toBeNull();
    expect(screen.getAllByTitle("year-marker")).not.toBeNull();
    // F1 segments display team abbreviations (first letter for narrow widths)
    // Team names: Red Bull (R), McLaren (M), Mercedes (M), Ferrari (F)
    expect(screen.getByText("R")).toBeInTheDocument();
    expect(screen.getAllByText("M").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("F")).toBeInTheDocument();
  });
});
