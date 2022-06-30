import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { SlotDisplay } from "../../../apis/SlotMachine";

interface ReelDisplayProps {
  reel: SlotDisplay[];
}

const cellStyles: React.CSSProperties = {
  minHeight: 39,
  fontWeight: 900,
};

const ReelDisplay: React.FC<ReelDisplayProps> = (props: ReelDisplayProps) => {
  const { reel } = props;
  /** generate code for slot machine */
  const getSlots = React.useCallback((): React.ReactNode[] => {
    // display for slots
    const slots = [];
    for (let i = 0; i < 3; i += 1) {
      // create 3 cells in a row
      const row = reel.map((reelRow, j) => (
        <TableCell key={`${j},${i}`}>
          <Typography
            variant="h4"
            align="center"
            color="secondary"
            style={cellStyles}
          >
            {reelRow[i]}
          </Typography>
        </TableCell>
      ));
      // separate into rows
      const slotRow = <TableRow key={`row${i}`}>{row}</TableRow>;
      slots.push(slotRow);
    }
    return slots;
  }, [reel]);

  return (
    <Table>
      <TableBody>{getSlots()}</TableBody>
    </Table>
  );
};

export default ReelDisplay;
