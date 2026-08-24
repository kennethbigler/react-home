import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandableCard from "../../../common/expandable-card";
import Row from "../../../common/timeline-parts/Row";
import {
  getTimelineRange,
  getTimelineRows,
  getYearMarkers,
} from "./timelineHelpers";
import { type ContractData, MERCEDES_HEX } from "../../../../constants/f1";
import type { FormatOutput } from "../../../../apis/DateHelper";

interface TimelineCardProps {
  /** contract spans used to build timeline segments */
  data: ContractData[];
}

const DATE_FORMAT: FormatOutput = "MMMM Y";

/** TimelineCard  ->  Row  ->  Segment
 **                       |->  YearMarker */
const TimelineCard = ({ data }: TimelineCardProps) => {
  const theme = useTheme();
  const range = getTimelineRange(data);
  const rows = range ? getTimelineRows(data, range) : [];

  return (
    <ExpandableCard
      backgroundColor={MERCEDES_HEX}
      title="F1 Team History"
      subtitle={
        range
          ? `Drivers over 100 points in 2025 · ${range.start.format(DATE_FORMAT)} - ${range.end.format(DATE_FORMAT)}`
          : "Drivers over 100 points in 2025"
      }
      inverted
    >
      <Box sx={{ width: "100%", pb: "7px" }}>
        {range ? (
          <Row
            segments={getYearMarkers(range, theme.palette.error.main)}
            yearMarkers
          />
        ) : null}
        {rows.map(({ key, segments }, i) => (
          <Row key={key} segments={segments} first={i === 0} />
        ))}
      </Box>
    </ExpandableCard>
  );
};

export default TimelineCard;
