import { memo } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

interface CarChartControlsProps {
  hideFamily: boolean;
  hideKen: boolean;
  onClick: (isKen: boolean) => () => void;
}

const CarChartControls = memo(
  ({ onClick, hideFamily, hideKen }: CarChartControlsProps) => (
    <ButtonGroup sx={{ marginTop: 3 }}>
      <Button
        onClick={onClick(false)}
        variant={hideFamily ? "contained" : "outlined"}
        color="error"
      >
        Hide Family Cars
      </Button>
      <Button
        onClick={onClick(true)}
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
