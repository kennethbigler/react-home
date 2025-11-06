import { memo } from "react";
import { FormatOutput } from "../../../../apis/DateHelper";
import ExpandableCard from "../../../common/expandable-card";
import Row from "./Row";
import { START, END, getYearMarkers, getSegments } from "./timelineHelpers";
import { CarEntry } from "../../../../constants/cars";

interface TimelineCardProps {
  /** reads "car" from each array entry and creates segments */
  data: CarEntry[];
  useFStart: boolean;
  useKStart: boolean;
  onClick: (title: string) => void;
}

const DATE_FORMAT: FormatOutput = "MMMM Y";
/** Sorting function by month */
const monthSort = (a: CarEntry, b: CarEntry): number => {
  let diff = a.start.diff(b.start, "months");
  if (diff === 0) {
    diff = a.end.diff(b.end, "months");
  }
  return diff;
};
const kMonthSort = (a: CarEntry, b: CarEntry): number => {
  let diff = (a.kStart || a.start).diff(b.kStart || b.start, "months");
  if (diff === 0) {
    diff = (a.fStart || a.end).diff(b.fStart || b.end, "months");
  }
  return diff;
};
const fMonthSort = (a: CarEntry, b: CarEntry): number => {
  let diff = (a.fStart || a.start).diff(b.fStart || b.start, "months");
  if (diff === 0) {
    diff = (a.kStart || a.end).diff(b.kStart || b.end, "months");
  }
  return diff;
};

/** TimelineCard  ->  Timeline  ->  Row  ->  Segment
 **                                     |->  YearMarkers */
const TimelineCard = memo(
  ({ data: propsData, useFStart, useKStart, onClick }: TimelineCardProps) => {
    // get immutable data from props and sort by start date
    const data: CarEntry[] = [...propsData].sort(
      useFStart ? fMonthSort : useKStart ? kMonthSort : monthSort,
    );
    // track elements added already
    const added: boolean[] = [];

    return (
      <ExpandableCard
        backgroundColor="black"
        title="Ken's Cars"
        subtitle={`${START.format(DATE_FORMAT)} - ${END.format(DATE_FORMAT)}`}
      >
        <div style={{ width: "100%", paddingBottom: 7 }}>
          <Row key={data.length} segments={getYearMarkers()} yearMarkers />
          {data.map((elm, i) => {
            const segments = getSegments(
              data,
              added,
              useKStart,
              useFStart,
              elm,
              i,
            );
            return segments.length ? (
              <Row
                key={i}
                segments={segments}
                first={i === 0}
                onClick={onClick}
              />
            ) : null;
          })}
        </div>
      </ExpandableCard>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison logic
    return (
      prevProps.useFStart === nextProps.useFStart &&
      prevProps.useKStart === nextProps.useKStart &&
      prevProps.data.length === nextProps.data.length
    );
  },
);

TimelineCard.displayName = "TimelineCard";

export default TimelineCard;
