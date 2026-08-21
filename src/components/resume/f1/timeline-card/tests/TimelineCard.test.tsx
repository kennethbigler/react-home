import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import TimelineCard from "../TimelineCard";
import { getTimelineRange } from "../timelineHelpers";

import dateObj, { type DateObj } from "../../../../../apis/DateHelper";
import type { ContractData } from "../../../../../constants/f1";

const FROZEN_NOW = new Date("2026-08-21T12:00:00.000Z");

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

const addMonth = (date: DateObj): DateObj => {
  const next = date.month + 1;
  const year = date.year + Math.floor(next / 12);
  const month = (next % 12) + 1;
  return dateObj(`${year}-${String(month).padStart(2, "0")}`);
};

const expectedRangeEnd = (latestEnd: DateObj): string => {
  const paddedEnd = addMonth(latestEnd);
  const today = dateObj();
  return (today.diff(paddedEnd, "months") > 0 ? today : paddedEnd).format(
    "MMMM Y",
  );
};

describe("resume | f1 | timeline-card | TimelineCard", () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: FROZEN_NOW, toFake: ["Date"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders as expected", () => {
    render(<TimelineCard data={data} />);

    // verify ExpandableCard
    expect(screen.getByText("F1 Team History")).toBeInTheDocument();
    expect(
      screen.getByText(
        `Drivers over 100 points in 2025 · June 2019 - ${dateObj().format("MMMM Y")}`,
      ),
    ).toBeInTheDocument();

    // verify Timeline
    expect(screen.getAllByTitle("year")).not.toBeNull();
    expect(screen.getAllByTitle("year-marker")).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "Red Bull" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "McLaren" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mercedes" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ferrari" })).toBeInTheDocument();
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

    const expectedEnd = expectedRangeEnd(dateObj("2027-12"));
    const range = getTimelineRange(withFuture);
    expect(range?.start.format("MMMM Y")).toBe("January 2019");
    expect(range?.end.format("MMMM Y")).toBe(expectedEnd);

    render(<TimelineCard data={withFuture} />);
    expect(
      screen.getByText(
        `Drivers over 100 points in 2025 · January 2019 - ${expectedEnd}`,
      ),
    ).toBeInTheDocument();
  });

  it("renders fallback subtitle without timeline rows when data is empty", () => {
    render(<TimelineCard data={[]} />);

    expect(screen.getByText("F1 Team History")).toBeInTheDocument();
    expect(
      screen.getByText("Drivers over 100 points in 2025"),
    ).toBeInTheDocument();
    expect(screen.queryByTitle("year")).not.toBeInTheDocument();
    expect(screen.queryByTitle("year-marker")).not.toBeInTheDocument();
  });

  it("returns no range for an empty dataset", () => {
    expect(getTimelineRange([])).toBeUndefined();
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

    const ferrari = screen.getByRole("button", { name: "Ferrari - Hamilton" });
    const antonelli = screen.getByRole("button", {
      name: "Mercedes - Antonelli",
    });
    expect(ferrari.parentElement).not.toBe(antonelli.parentElement);
    expect(
      ferrari.compareDocumentPosition(antonelli) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
