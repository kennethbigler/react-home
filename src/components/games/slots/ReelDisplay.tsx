import { useCallback, CSSProperties, ReactElement } from "react";
import { SlotDisplay } from "./slotMachine";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

interface ReelDisplayProps {
  reel: SlotDisplay[];
}

const cellStyles: CSSProperties = {
  minHeight: 39,
  fontWeight: 900,
};

const ReelDisplay = ({ reel }: ReelDisplayProps) => {
  /** generate code for slot machine */
  const getSlots = useCallback((): ReactElement[] => {
    // display for slots
    const slots = [];
    for (let i = 0; i < 3; i += 1) {
      // create 3 cells in a row
      const row = reel.map((reelRow, j) => (
        <TableCell key={`${j},${i}`}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
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
    <Table aria-label="slots displayed in a 3 by 3 grid">
      <TableBody>{getSlots()}</TableBody>
    </Table>
  );
};

export default ReelDisplay;
