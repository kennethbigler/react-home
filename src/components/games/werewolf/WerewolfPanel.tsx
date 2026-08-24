import { memo, type SyntheticEvent, type CSSProperties } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
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
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
        <Box
          role="group"
          aria-label={`${name} rating`}
          sx={{ display: "flex", alignItems: "flex-start" }}
        >
          <Rating
            name={`${name}-rating`}
            max={count || 1}
            sx={{
              flexWrap: "wrap",
              minWidth: Math.min(24 * (count || 1), 24 * 7),
              pt: 1,
            }}
            onChange={(_e, numStars) =>
              handleStar(numStars ? value : -value, numStars || 0, name)
            }
          />
        </Box>
        <Accordion
          expanded={expanded === expandedKey}
          onChange={handleChange(expandedKey)}
          sx={{ flex: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div style={containerStyles}>
              <Typography>{name}</Typography>
              <Typography>Cost: {value}</Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>{description}</AccordionDetails>
        </Accordion>
      </Box>
    </Grid>
  ),
);

WerewolfPanel.displayName = "WerewolfPanel";

export default WerewolfPanel;
