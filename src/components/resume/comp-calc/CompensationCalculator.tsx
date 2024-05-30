import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import compCalcState, {
  compCalcReadOnlyState,
} from "../../../recoil/comp-calculator-state";
import { months } from "../../../apis/DateHelper";

const tfProps: TextFieldProps = {
  variant: "standard",
  fullWidth: true,
  margin: "dense",
};

const currentYear = new Date().getFullYear() - 2000;
const years: number[] = [];
for (let i = 0; i <= currentYear; i += 1) {
  years.push(2000 + i);
}
years.reverse();

/** Compensation Calculator
 * -----     SALARY     -----
 * Date {DateObj}
 * Salary {number}
 * Bonus {number}
 * Stock (Adj) {number} - calculated
 * Stock {number} - calculated
 * Total {number} - calculated
 * Total (Adj) {number} - calculated
 * Net {number} - calculated
 * -----     STOCK     -----
 * Price Now {number} - number (V1) - API (V2)
 * Price Then {number} - number (V1) - API (V2)
 * Expires On {number} - YEARS
 * Grant Qty {number} - STOCKS
 * Grant Then - calculated
 * Grant Now - calculated
 */
const CompensationCalculator = () => {
  const [compEntries, setCompEntries] = useRecoilState(compCalcState);
  const compCalcEntries = useRecoilValue(compCalcReadOnlyState);
  const [open, setOpen] = React.useState(false);

  const openEntryModal = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      <Button onClick={openEntryModal}>New Entry</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Comp Entry</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex" }}>
            <FormControl fullWidth>
              <InputLabel id="month-select-label">Month</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                label="Month"
              >
                {months.map((month, i) => (
                  <MenuItem value={i + 1} key={i}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select labelId="year-select-label" id="year-select" label="Year">
                {years.map((year) => (
                  <MenuItem value={year} key={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <TextField label="Salary" {...tfProps} />
          <TextField label="Bonus" {...tfProps} />
          <DialogContentText variant="h6" component="h4" sx={{ marginTop: 7 }}>
            Stock
          </DialogContentText>
          <TextField label="Grant Quantity" {...tfProps} />
          <TextField label="Grant Duration" {...tfProps} />
          <TextField label="Grant Value Then" {...tfProps} />
          <TextField label="Grant Value Now" {...tfProps} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CompensationCalculator;
