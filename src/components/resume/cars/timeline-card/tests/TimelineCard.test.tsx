import { render, screen } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import TimelineCard from "../TimelineCard";

import dateObj from "../../../../../apis/DateHelper";
import type { CarEntry } from "../../../../../constants/cars";

const carReqs = {
  src: "somewhere",
  transmission: "Manual",
  horsepower: 1,
  MPG: 2,
  torque: 3,
  weight: 4,
  zTo60: 5,
};

const data: CarEntry[] = [
  {
    ...carReqs,
    color: "red",
    title: "Title 1",
    car: "Body 1",
    start: dateObj("2019-06"),
    end: dateObj("2019-09"),
  },
  {
    ...carReqs,
    color: "blue",
    title: "Title 2",
    car: "Body 2",
    start: dateObj("2019-07"),
    end: dateObj("2020-02"),
    inverted: true,
  },
  {
    ...carReqs,
    color: "blue",
    title: "Title 3",
    car: "Body 3",
    start: dateObj("2019-08"),
    end: dateObj("2020-02"),
  },
  {
    ...carReqs,
    color: "blue",
    title: "Title 4",
    car: "Body 4",
    start: dateObj("2019-09"),
    end: dateObj("2020-02"),
    inverted: true,
  },
];

describe("common | timeline-card | TimelineCard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders as expected", () => {
    render(
      <TimelineCard
        data={data}
        useFStart={false}
        useKStart={false}
        onClick={() => () => {}}
      />,
    );

    // verify ExpandableCard
    expect(screen.getByText("Ken's Cars")).toBeInTheDocument();
    expect(
      screen.getByText(`March 2008 - ${dateObj().format("MMMM Y")}`),
    ).toBeInTheDocument();

    // verify Timeline
    expect(screen.getAllByTitle("year")).not.toBeNull();
    expect(screen.getAllByTitle("year-marker")).not.toBeNull();
    expect(screen.getByTitle("Title 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Title 2" })).toBeInTheDocument();
  });

  it("keeps the full car name on narrow viewports", () => {
    const longCarName = "Porsche Cayenne E-Hybrid";
    const longCarTitle = "Porsche Cayenne E-Hybrid (2019)";
    const narrowData: CarEntry[] = [
      {
        ...carReqs,
        color: "red",
        title: longCarTitle,
        car: longCarName,
        start: dateObj("2019-06"),
        end: dateObj("2019-09"),
      },
    ];

    vi.spyOn(window, "innerWidth", "get").mockReturnValue(375);

    render(
      <TimelineCard
        data={narrowData}
        useFStart={false}
        useKStart={false}
        onClick={() => {}}
      />,
    );

    const button = screen.getByRole("button", { name: longCarTitle });
    expect(button).toHaveTextContent(longCarName);
    expect(button).toHaveAttribute("title", longCarTitle);
  });
});
