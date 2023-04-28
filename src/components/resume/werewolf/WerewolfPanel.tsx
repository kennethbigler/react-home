import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import nl2br from "react-newline-to-break";
import Typography from "@mui/material/Typography";

interface WerewolfPanelProps {
  expanded?: string;
  expandedKey: string;
  handleChange: (
    panel: string
  ) => (_event: React.SyntheticEvent<Element, Event>, exp?: boolean) => void;
  name: string;
  description: string;
  value: number;
  count?: number;
}

const containerStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  width: "95%",
};
const itemStyles: React.CSSProperties = { display: "flex" };

const WerewolfPanel: React.FC<WerewolfPanelProps> = React.memo(
  (props: WerewolfPanelProps) => {
    const {
      expanded,
      expandedKey,
      handleChange,
      name,
      description,
      value,
      count,
    } = props;

    return (
      <Accordion
        expanded={expanded === expandedKey}
        onChange={handleChange(expandedKey)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div style={containerStyles}>
            <Typography style={itemStyles}>{name}</Typography>
            {count && (
              <Typography style={itemStyles}>Count: {count}</Typography>
            )}
            <Typography style={itemStyles}>Cost: {value}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>{nl2br(description)}</AccordionDetails>
      </Accordion>
    );
  }
);

export default WerewolfPanel;
