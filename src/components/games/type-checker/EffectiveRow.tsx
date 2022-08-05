import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { SxProps } from "@mui/material";
import { green, red, yellow } from "@mui/material/colors";
import { Effectiveness } from "../../../constants/type-checker";

const buttonStyles = { padding: "4px 2px" };
const colors = {
  0: red[200],
  0.5: yellow[200],
  2: green[200],
};

interface EffectiveRowProps {
  data: Effectiveness[][];
  name: string;
  idx: number;
  onClick: (i: number) => () => void;
}

const EffectiveRow: React.FC<EffectiveRowProps> = ({
  data,
  name,
  idx,
  onClick,
}) => (
  <TableRow>
    <TableCell sx={{ padding: 0 }}>
      <Button
        variant="contained"
        fullWidth
        sx={buttonStyles}
        onClick={onClick(idx)}
      >
        {name}
      </Button>
    </TableCell>
    {data[idx].map((val, j) => {
      const cellSx: SxProps = { padding: 0 };
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
