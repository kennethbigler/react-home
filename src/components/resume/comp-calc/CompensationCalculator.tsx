import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

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
  const [open, setOpen] = React.useState(false);

  const handleNewEntry = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Typography variant="h2" component="h1">
        Compensation Calculator
      </Typography>
      <Button onClick={handleNewEntry}>New Entry</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Comp Entry</DialogTitle>
        <DialogContent>
          <DialogContentText>Date - DateObj</DialogContentText>
          <DialogContentText>Salary - number</DialogContentText>
          <DialogContentText>Bonus - number</DialogContentText>
          <DialogContentText>Grant Qty - number - STOCKS</DialogContentText>
          <DialogContentText>Grant Duration - number - YEARS</DialogContentText>
          {/* <DialogContentText>Stock Ticker</DialogContentText> REPLACES BELOW */}
          <Typography variant="h6">Manual Entry</Typography>
          <DialogContentText>Grant Value Then</DialogContentText>
          <DialogContentText>Grant Value Now</DialogContentText>
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
