import { CSSProperties } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { green, orange, red, yellow } from "@mui/material/colors";
import { Effectiveness, Types } from "../../../constants/type-checker";

const buttonStyles = { padding: "4px 2px" };
const colors = {
  0: red[200],
  0.25: orange[200],
  0.5: yellow[200],
  2: green[200],
  4: green[500],
};

interface EffectiveRowProps {
  data: Effectiveness[][];
  type: Types;
  idx: number;
  onClick: (i: number) => () => void;
}

/** dynamic row display */
const EffectiveRow = ({ data, type, idx, onClick }: EffectiveRowProps) => (
  <TableRow>
    <TableCell padding="none" component="th" scope="row">
      <Button
        variant="contained"
        fullWidth
        sx={{
          ...buttonStyles,
          backgroundColor: type.color,
          color: type.inverted ? "black" : "white",
        }}
        onClick={onClick(idx)}
      >
        {type.name}
      </Button>
    </TableCell>
    {data[idx].map((val, j) => {
      const cellSx: CSSProperties = { padding: 0 };
      if (val !== 1) {
        cellSx.backgroundColor = colors[val];
        cellSx.color = "black";
      }

      return (
        <TableCell key={`eff-${idx}-${j}`} sx={cellSx} align="center">
          {val}
        </TableCell>
      );
    })}
  </TableRow>
);

export default EffectiveRow;
