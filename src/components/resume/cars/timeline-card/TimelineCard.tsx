import { grey } from "@mui/material/colors";
import dateObj, { FormatOutput } from "../../../../apis/DateHelper";
import ExpandableCard from "../../../common/expandable-card";
import Timeline from "./Timeline";
import { DataEntry } from "./types";

interface TimelineCardProps {
  /** reads [selector] from each array entry and creates segments */
  data: DataEntry[];
}

const START = dateObj("2008-03");
const END = dateObj();
const DATE_FORMAT: FormatOutput = "MMMM Y";

/* TimelineCard  ->  Timeline  ->  Row  ->  Segment
 *                                     |->  YearMarkers */
/** function to generate timeline card */
const TimelineCard = ({ data }: TimelineCardProps) => (
  <ExpandableCard
    backgroundColor={grey[800]}
    subtitle={`${START.format(DATE_FORMAT)} - ${END.format(DATE_FORMAT)}`}
    title="Ken's Cars"
  >
    <Timeline data={data} start={START} end={END} />
  </ExpandableCard>
);

export default TimelineCard;
