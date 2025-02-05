import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

interface CarChartControlsProps {
  hideFamily: boolean;
  hideKen: boolean;
  onClick: (key: string) => () => void;
}

const CarChartControls = React.memo(
  ({ onClick, hideFamily, hideKen }: CarChartControlsProps) => (
    <ButtonGroup sx={{ marginTop: 3 }}>
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
  ),
);

CarChartControls.displayName = "CarChartControls";

export default CarChartControls;
