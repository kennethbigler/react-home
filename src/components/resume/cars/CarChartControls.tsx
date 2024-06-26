import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";

interface CarChartControlsProps {
  hideFamily: boolean;
  hideKen: boolean;
  onClick: (key: string) => () => void;
}

const CarChartControls = React.memo(
  ({ onClick, hideFamily, hideKen }: CarChartControlsProps) => (
    <div>
      <Typography variant="h3" component="h2">
        Hide Data:
      </Typography>
      <ButtonGroup
        color="secondary"
        aria-label="outlined secondary button group controlling graph"
      >
        <Button
          onClick={onClick("family")}
          variant={hideFamily ? "contained" : "outlined"}
        >
          Hide Family Cars
        </Button>
        <Button
          onClick={onClick("ken")}
          variant={hideKen ? "contained" : "outlined"}
        >
          Hide Ken&apos;s Cars
        </Button>
      </ButtonGroup>
    </div>
  ),
);

export default CarChartControls;
