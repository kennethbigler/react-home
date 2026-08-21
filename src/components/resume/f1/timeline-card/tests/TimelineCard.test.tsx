import { render, screen } from "@testing-library/react";
import TimelineCard from "../TimelineCard";
import { getTimelineRange } from "../timelineHelpers";

import dateObj from "../../../../../apis/DateHelper";
import type { ContractData } from "../../../../../constants/f1";

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
    expect(
      screen.getByText(
        "Drivers over 100 points in 2025 · June 2019 - March 2020",
      ),
    ).toBeInTheDocument();

    // verify Timeline
    expect(screen.getAllByTitle("year")).not.toBeNull();
    expect(screen.getAllByTitle("year-marker")).not.toBeNull();
    expect(screen.getByText("Red Bull")).toBeInTheDocument();
    expect(screen.getByText("McLaren")).toBeInTheDocument();
    expect(screen.getByText("Mercedes")).toBeInTheDocument();
    expect(screen.getByText("Ferrari")).toBeInTheDocument();
  });

  it("uses the latest contract end as the timeline range", () => {
    const withFuture: ContractData[] = [
      ...data,
      {
        color: "orange",
        team: "McLaren - Norris",
        start: dateObj("2019"),
        end: dateObj("2027-12"),
        inverted: true,
      },
    ];

    const range = getTimelineRange(withFuture);
    expect(range.start.format("MMMM Y")).toBe("January 2019");
    expect(range.end.format("MMMM Y")).toBe("January 2028");

    render(<TimelineCard data={withFuture} />);
    expect(
      screen.getByText(
        "Drivers over 100 points in 2025 · January 2019 - January 2028",
      ),
    ).toBeInTheDocument();
  });

  it("packs later contracts in dataset order when start dates match", () => {
    const overlapping: ContractData[] = [
      {
        color: "orange",
        team: "07-12 McLaren",
        start: dateObj("2012"),
        end: dateObj("2013"),
      },
      {
        color: "teal",
        team: "Mercedes - Hamilton",
        start: dateObj("2013"),
        end: dateObj("2025"),
      },
      {
        color: "red",
        team: "Ferrari - Hamilton",
        start: dateObj("2025"),
        end: dateObj("2027-12"),
      },
      {
        color: "teal",
        team: "Mercedes - Antonelli",
        start: dateObj("2025"),
        end: dateObj("2026-12"),
      },
    ];

    render(<TimelineCard data={overlapping} />);

    const ferrari = screen.getByTitle("Ferrari - Hamilton");
    const antonelli = screen.getByTitle("Mercedes - Antonelli");
    expect(
      ferrari.compareDocumentPosition(antonelli) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
