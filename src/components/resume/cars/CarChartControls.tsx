import { memo } from "react";
import { Button, ButtonGroup } from "@mui/material";
interface CarChartControlsProps {
  hideFamily: boolean;
  hideKen: boolean;
  onHideClick: (isKen: boolean) => void;
}

const CarChartControls = memo(
  ({ onHideClick, hideFamily, hideKen }: CarChartControlsProps) => (
    <ButtonGroup sx={{ marginTop: 3 }}>
      <Button
        onClick={() => onHideClick(false)}
        variant={hideFamily ? "contained" : "outlined"}
        color="error"
      >
        Hide Family Cars
      </Button>
      <Button
        onClick={() => onHideClick(true)}
        variant={hideKen ? "contained" : "outlined"}
        color="error"
      >
        Hide Ken&apos;s Cars
      </Button>
    </ButtonGroup>
  ),
);

CarChartControls.displayName = "CarChartControls";

export default CarChartControls;
