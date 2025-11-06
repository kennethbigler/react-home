import { memo, SyntheticEvent, CSSProperties } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

interface WerewolfPanelProps {
  expanded?: string;
  expandedKey: string;
  handleChange: (
    panel: string,
  ) => (_event: SyntheticEvent<Element, Event>, exp?: boolean) => void;
  handleStar: (value: number, count: number, role: string) => void;
  name: string;
  description: string;
  value: number;
  count?: number;
}

const containerStyles: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginLeft: 10,
  marginRight: 10,
};

const WerewolfPanel = memo(
  ({
    expanded,
    expandedKey,
    handleChange,
    handleStar,
    name,
    description,
    value,
    count,
  }: WerewolfPanelProps) => (
    <Grid size={12}>
      <Accordion
        expanded={expanded === expandedKey}
        onChange={handleChange(expandedKey)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Rating
            max={count || 1}
            sx={{
              flexWrap: "wrap",
              minWidth: Math.min(24 * (count || 1), 24 * 7),
            }}
            onChange={(_e, numStars) =>
              handleStar(numStars ? value : -value, numStars || 0, name)
            }
          />
          <div style={containerStyles}>
            <Typography>{name}</Typography>
            <Typography>Cost: {value}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>{description}</AccordionDetails>
      </Accordion>
    </Grid>
  ),
);

WerewolfPanel.displayName = "WerewolfPanel";

export default WerewolfPanel;
