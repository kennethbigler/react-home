import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import { HideObject } from "./CarChart";

interface CarChartControlsProps {
  hide: HideObject;
  onClick: (key: ShowKey) => () => void;
  vw: number;
}

export type ShowKey = keyof HideObject;

const CarChartControls = React.memo(
  ({ onClick, hide, vw }: CarChartControlsProps) => (
    <div>
      <Typography variant="h3" component="h2">
        Hide Data:
      </Typography>
      <ButtonGroup
        color="secondary"
        aria-label="outlined secondary button group controlling graph"
      >
        <Button
          onClick={onClick("MPG")}
          variant={hide.MPG ? "contained" : "outlined"}
        >
          MPG
        </Button>
        <Button
          onClick={onClick("horsepower")}
          variant={hide.horsepower ? "contained" : "outlined"}
        >
          Horsepower
        </Button>
        <Button
          onClick={onClick("weight")}
          variant={hide.weight ? "contained" : "outlined"}
        >
          Weight
        </Button>
        <Button
          onClick={onClick("powerToWeight")}
          variant={hide.powerToWeight ? "contained" : "outlined"}
          aria-label="power to weight ratio"
        >
          {vw >= 435 ? "Power-to-Weight" : "PTW"}
        </Button>
      </ButtonGroup>
      <ButtonGroup
        color="secondary"
        aria-label="outlined secondary button group controlling graph part 3"
      >
        <Button
          onClick={onClick("family")}
          variant={hide.family ? "contained" : "outlined"}
        >
          {vw >= 435 ? "Hide Family's" : "Fam"}
        </Button>
        <Button
          onClick={onClick("ken")}
          variant={hide.ken ? "contained" : "outlined"}
        >
          {vw >= 435 ? "Hide Ken's" : "Ken"}
        </Button>
      </ButtonGroup>
    </div>
  )
);

export default CarChartControls;
