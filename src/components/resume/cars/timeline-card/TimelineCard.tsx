import * as React from "react";
import { grey } from "@mui/material/colors";
import { FormatOutput } from "../../../../apis/DateHelper";
import ExpandableCard from "../../../common/expandable-card";
import Row from "./Row";
import { DataEntry, SegmentType } from "./types";
import {
  addEmptySegment,
  addSegment,
  END,
  getTimeFromStart,
  getYearMarkers,
  monthSort,
  START,
  WIDTH,
} from "./timelineHelpers";

interface TimelineCardProps {
  /** reads "car" from each array entry and creates segments */
  data: DataEntry[];
}

const DATE_FORMAT: FormatOutput = "MMMM Y";

/* TimelineCard  ->  Timeline  ->  Row  ->  Segment
 *                                     |->  YearMarkers */
/** function to generate timeline card */
const TimelineCard = ({ data: propsData }: TimelineCardProps) => {
  // get immutable data from props and sort by start date
  const data: DataEntry[] = React.useMemo(
    () => [...propsData].sort(monthSort),
    [propsData],
  );
  // track elements added already
  const added: boolean[] = [];

  /** break data up into segments */
  const getSegments = (elm: DataEntry, i: number): SegmentType[] => {
    // skip if added already
    if (added[i]) {
      return [];
    }

    // local variables
    const segments: SegmentType[] = [];
    const { start: segStart, end: segEnd } = elm;
    let beginning = getTimeFromStart(segStart);
    let ending = getTimeFromStart(segEnd);

    // add main segments
    addEmptySegment(segments, beginning);
    addSegment(segments, elm, beginning, ending);

    // track that segments have been added
    added[i] = true;

    // find any other segments that will fit
    for (let j = i + 1; j < data.length; j += 1) {
      // skip if added already
      if (!added[j]) {
        // test segment
        const { start: jStart, end: jEnd } = data[j];
        beginning = getTimeFromStart(jStart);

        // if start is after end of main segment
        if (beginning >= ending) {
          // add filler in between end/start
          addEmptySegment(segments, beginning - ending);
          // add next segment
          ending = getTimeFromStart(jEnd);
          addSegment(segments, data[j], beginning, ending);
          // mark as already added
          added[j] = true;
        }
      }
    }

    // get last segment
    addEmptySegment(segments, WIDTH - ending);

    return [...segments];
  };

  return (
    <ExpandableCard
      backgroundColor={grey[800]}
      subtitle={`${START.format(DATE_FORMAT)} - ${END.format(DATE_FORMAT)}`}
      title="Ken's Cars"
    >
      <div style={{ width: "100%", paddingBottom: 7 }}>
        <Row key={data.length} segments={getYearMarkers()} yearMarkers />
        {data.map((elm, i) => {
          const segments = getSegments(elm, i);
          return segments.length ? (
            <Row key={i} segments={segments} first={i === 0} />
          ) : null;
        })}
      </div>
    </ExpandableCard>
  );
};

export default TimelineCard;
