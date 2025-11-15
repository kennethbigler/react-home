import { useState, CSSProperties, ReactNode, ReactElement } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  Collapse,
  Grid,
} from "@mui/material";

const cardStyles: CSSProperties = { marginTop: 40, overflow: "visible" };

interface ExpandableCardProps {
  /** change the background color of the title bar */
  backgroundColor?: string;
  /** content to be displayed in the main section of the card */
  children?: ReactNode;
  /** invert the color of the title and subtitle text */
  inverted?: boolean;
  /** subtitle content */
  subtitle?: string | ReactElement;
  /** title content */
  title?: string | ReactElement;
}

const ExpandableCard = ({
  inverted,
  title,
  subtitle,
  children,
  backgroundColor,
}: ExpandableCardProps) => {
  const [expanded, setExpanded] = useState(true);
  const toggleExpanded = () => setExpanded(!expanded);

  const { palette } = useTheme();

  const color = inverted ? "black" : "white";

  const headerStyle: CSSProperties = {
    backgroundColor: backgroundColor || palette.primary.dark,
    color,
  };

  return (
    <Card style={cardStyles}>
      <CardActionArea onClick={toggleExpanded} style={headerStyle}>
        <CardHeader
          subheader={subtitle}
          title={title}
          slotProps={{
            title: { variant: "h5", component: "h2" },
            subheader: { variant: "body1", style: { color } },
          }}
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
