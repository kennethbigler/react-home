import { grey } from "@mui/material/colors";
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
}

const DATE_FORMAT: FormatOutput = "MMMM Y";
/** Sorting function by month */
const monthSort = (a: CarEntry, b: CarEntry): number =>
  a.start.diff(b.start, "months");
const kMonthSort = (a: CarEntry, b: CarEntry): number =>
  (a.kStart || a.start).diff(b.kStart || b.start, "months");
const fMonthSort = (a: CarEntry, b: CarEntry): number =>
  (a.fStart || a.start).diff(b.fStart || b.start, "months");

/** TimelineCard  ->  Timeline  ->  Row  ->  Segment
 **                                     |->  YearMarkers */
const TimelineCard = ({
  data: propsData,
  useFStart,
  useKStart,
}: TimelineCardProps) => {
  // get immutable data from props and sort by start date
  const data: CarEntry[] = [...propsData].sort(
    useFStart ? fMonthSort : useKStart ? kMonthSort : monthSort,
  );
  // track elements added already
  const added: boolean[] = [];

  return (
    <ExpandableCard
      backgroundColor={grey[800]}
      subtitle={`${START.format(DATE_FORMAT)} - ${END.format(DATE_FORMAT)}`}
      title="Ken's Cars"
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
            <Row key={i} segments={segments} first={i === 0} />
          ) : null;
        })}
      </div>
    </ExpandableCard>
  );
};

export default TimelineCard;
