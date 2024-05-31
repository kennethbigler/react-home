import * as React from "react";
import { useRecoilValue } from "recoil";
import { Box, Typography } from "@mui/material";
import {
  CompEntry,
  compCalcReadOnlyState,
} from "../../../recoil/comp-calculator-state";

interface CompEntryProps {
  compEntries: CompEntry[];
}

const CompDisplay: React.FC<CompEntryProps> = ({ compEntries }) => {
  const compCalcEntries = useRecoilValue(compCalcReadOnlyState);

  return (
    <>
      <Typography variant="h2" component="h1">
        Comp Calculator
      </Typography>

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
        const {
          stock,
          stockAdj,
          total,
          totalAdj,
          netDiff,
          grantThen,
          grantNow,
        } = compCalcEntries[i];
        return (
          <Box key={`comp-calc-entry-${i}`}>
            <Typography variant="h3">SALARY</Typography>
            <Typography>Date - {entryDate.format("MMMM Y")}</Typography>
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
};

export default CompDisplay;
