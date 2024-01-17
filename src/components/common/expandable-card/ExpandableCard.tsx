import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import useToggleState from "../../../hooks/useToggle";

const cardStyles: React.CSSProperties = { marginTop: 40, overflow: "visible" };
const headerStyles: React.CSSProperties = {
  borderRadius: 3,
  cursor: "pointer",
  marginLeft: 15,
  marginRight: 15,
  position: "relative",
  top: -20,
};

interface ExpandableCardProps {
  /** change the background color of the title bar */
  backgroundColor?: string;
  /** content to be displayed in the main section of the card */
  children?: React.ReactNode;
  /** invert the color of the title and subtitle text */
  inverted?: boolean;
  /** subtitle content */
  subtitle?: string | React.ReactNode;
  /** title content */
  title?: string | React.ReactNode;
}

const ExpandableCard = (props: ExpandableCardProps): React.ReactElement => {
  const [expanded, toggleExpanded] = useToggleState(true);
  const { palette } = useTheme();
  const { inverted, title, subtitle, children, backgroundColor } = props;

  const headerStyle = {
    ...headerStyles,
    backgroundColor: backgroundColor || palette.primary.dark,
  };
  if (palette.mode !== "dark") {
    headerStyle.boxShadow = `0px 15px 15px -10px ${grey[400]}`;
  } else {
    delete headerStyle.boxShadow;
  }
  headerStyle.color = inverted ? "black" : "white";
  const expandedHeaderStyle = { ...headerStyle, marginBottom: -20 };

  const subtitleJSX = (
    <Typography style={{ color: inverted ? "black" : "white" }} variant="body1">
      {subtitle}
    </Typography>
  );

  return (
    <Card style={cardStyles}>
      <CardHeader
        onClick={toggleExpanded}
        style={expanded ? expandedHeaderStyle : headerStyle}
        subheader={subtitleJSX}
        title={title}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container spacing={1} style={{ overflowY: "hidden" }}>
            {children}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ExpandableCard;
