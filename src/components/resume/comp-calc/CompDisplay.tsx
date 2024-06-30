import * as React from "react";
import { Box, Typography } from "@mui/material";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../recoil/comp-calculator-state";
import dateObj from "../../../apis/DateHelper";

interface CompEntryProps {
  compEntries: CompEntry[];
  compCalcEntries: CompCalcEntry[];
}

const CompDisplay: React.FC<CompEntryProps> = ({
  compEntries,
  compCalcEntries,
}) => (
  <>
    {compEntries.map((compEntry, i) => {
      const {
        entryDate,
        salary,
        bonus,
        priceNow,
        priceThen,
        grantDuration,
        grantQty,
      } = compEntry;
      const { stock, stockAdj, total, totalAdj, netDiff, grantThen, grantNow } =
        compCalcEntries[i];
      console.log(entryDate);
      return (
        <Box key={`comp-calc-entry-${i}`}>
          <Typography variant="h3">SALARY</Typography>
          <Typography>Date - {dateObj(entryDate).format("MMMM Y")}</Typography>
          <Typography>Salary - ${salary}</Typography>
          <Typography>Bonus - ${bonus}</Typography>
          <Typography>Stock (Adj) - ${stockAdj} *</Typography>
          <Typography>Stock - ${stock} *</Typography>
          <Typography>Total - ${total} *</Typography>
          <Typography>Total (Adj) - ${totalAdj} *</Typography>
          <Typography>Net - ${netDiff} *</Typography>
          <br />
          <Typography variant="h3">STOCK</Typography>
          <Typography>Price Now - ${priceNow}</Typography>
          <Typography>Price Then - ${priceThen}</Typography>
          <Typography>Grant Qty - {grantQty} stocks</Typography>
          <Typography>Grant Duration - {grantDuration} years</Typography>
          <Typography>Grant Then - ${grantThen} *</Typography>
          <Typography>Grant Now - ${grantNow} *</Typography>
        </Box>
      );
    })}
  </>
);

export default CompDisplay;
