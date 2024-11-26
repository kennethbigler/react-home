import { grey } from "@mui/material/colors";
import dateObj, { DateObj, FormatOutput } from "../../../apis/DateHelper";
import ExpandableCard from "../expandable-card";
import Timeline from "./Timeline";
import { TIMELINE_TITLE, DataEntry } from "./timeline-consts";
import workExperience from "../../../constants/work";

interface TimelineCardProps {
  /** background color of the expandable card top bar */
  backgroundColor?: string;
  /** reads [selector] from each array entry and creates segments */
  data?: DataEntry[];
  /** title content */
  title?: string;
  /** key to be used to read data */
  selector?: string;
  /** start of the timeline */
  start?: DateObj;
  /** end of the timeline */
  end?: DateObj;
  /** reduce year markers */
  yearMarkerFrequency?: number;
  /** enables title field to be long version */
  enableLongTitles?: boolean;
}

const DATE_FORMAT: FormatOutput = "MMMM Y";

/* TimelineCard  ->  Timeline  ->  Row  ->  Segment
 *                                     |->  YearMarkers */
/** function to generate timeline card */
const TimelineCard = ({
  data = workExperience,
  backgroundColor = grey[800],
  title = TIMELINE_TITLE,
  selector = "company",
  start = dateObj("2011-09"),
  end = dateObj(),
  yearMarkerFrequency = 1,
  enableLongTitles,
}: TimelineCardProps) => (
  <ExpandableCard
    backgroundColor={backgroundColor}
    subtitle={`${start.format(DATE_FORMAT)} - ${end.format(DATE_FORMAT)}`}
    title={title}
  >
    <Timeline
      data={data}
      selector={selector}
      start={start}
      end={end}
      yearMarkerFrequency={yearMarkerFrequency}
      enableLongTitles={enableLongTitles}
    />
  </ExpandableCard>
);

export default TimelineCard;
