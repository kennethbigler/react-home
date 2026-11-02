import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandableCard from "@/components/common/expandable-card";
import Row from "@/components/common/timeline-parts/Row";
import {
  getTimelineRange,
  getTimelineRows,
  getYearMarkers,
} from "./timelineHelpers";
import { type ContractData, MERCEDES_HEX } from "@/constants/f1";
interface TimelineCardProps {
  /** contract spans used to build timeline segments */
  data: ContractData[];
}

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
      subtitle="Drivers over 100 points in 2026"
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
