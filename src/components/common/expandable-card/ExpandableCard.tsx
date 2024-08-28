import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import useToggleState from "../../../hooks/useToggle";

const cardStyles: React.CSSProperties = { marginTop: 40, overflow: "visible" };

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

  const color = inverted ? "black" : "white";

  const headerStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || palette.primary.dark,
    color,
  };

  return (
    <Card style={cardStyles}>
      <CardActionArea onClick={toggleExpanded} style={headerStyle}>
        <CardHeader
          subheader={subtitle}
          title={title}
          titleTypographyProps={{ variant: "h5", component: "h2" }}
          subheaderTypographyProps={{ variant: "body1", style: { color } }}
        />
      </CardActionArea>
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
