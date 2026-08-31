import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, beforeEach, vi } from "vitest";
import TimelineCard from "../TimelineCard";
import { getTimelineRange } from "../timelineHelpers";

import dateObj from "@/apis/DateHelper";
import type { ContractData } from "@/constants/f1";

const FROZEN_NOW = new Date("2026-08-21T12:00:00.000Z");
const EXPECTED_FROZEN_TODAY = "August 2026";
const EXPECTED_JAN_2028 = "January 2028";

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
        `Drivers over 100 points in 2025 · June 2019 - ${EXPECTED_FROZEN_TODAY}`,
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

  it("extends the timeline end to today when contracts end in the past", () => {
    const range = getTimelineRange(data);

    expect(range?.end.format("MMMM Y")).toBe(EXPECTED_FROZEN_TODAY);
  });

  it("pads December contract ends into the next calendar year", () => {
    const contract: ContractData = {
      color: "orange",
      team: "McLaren - Norris",
      start: dateObj("2019"),
      end: dateObj("2027-12"),
      inverted: true,
    };

    const range = getTimelineRange([contract]);

    expect(range?.end.format("MMMM Y")).toBe(EXPECTED_JAN_2028);
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
    expect(range?.start.format("MMMM Y")).toBe("January 2019");
    expect(range?.end.format("MMMM Y")).toBe(EXPECTED_JAN_2028);

    render(<TimelineCard data={withFuture} />);
    expect(
      screen.getByText(
        `Drivers over 100 points in 2025 · January 2019 - ${EXPECTED_JAN_2028}`,
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

    const ferrariRow = screen.getByRole("group", {
      name: /Ferrari - Hamilton/i,
    });
    const antonelliRow = screen.getByRole("group", {
      name: /Mercedes - Antonelli/i,
    });
    expect(ferrariRow).not.toBe(antonelliRow);
    expect(
      screen.getByRole("button", { name: "Ferrari - Hamilton" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mercedes - Antonelli" }),
    ).toBeInTheDocument();
  });

  it("timeline buttons support keyboard focus and activation", () => {
    render(<TimelineCard data={data} />);

    const redBull = screen.getByRole("button", { name: "Red Bull" });
    redBull.focus();
    expect(redBull).toHaveFocus();

    fireEvent.keyDown(redBull, { key: "Enter", code: "Enter" });
    expect(redBull).toBeInTheDocument();

    fireEvent.keyDown(redBull, { key: " ", code: "Space" });
    expect(redBull).toBeInTheDocument();
  });

  it("renders without accessibility violations", async () => {
    const { container } = render(<TimelineCard data={data} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
