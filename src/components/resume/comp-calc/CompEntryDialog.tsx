import * as React from "react";
import {
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
  SelectChangeEvent,
  TextField,
  TextFieldProps,
} from "@mui/material";
import dateHelper, { months } from "../../../apis/DateHelper";
import { CompEntry } from "../../../recoil/comp-calculator-state";

const tfProps: TextFieldProps = {
  variant: "standard",
  fullWidth: true,
  margin: "dense",
  type: "number",
};

const currentYear = new Date().getFullYear() - 2000;
const years: number[] = [];
for (let i = 0; i <= currentYear; i += 1) {
  years.push(2000 + i);
}
years.reverse();

interface CompEntryDialogProps {
  open: boolean;
  compEntry?: CompEntry;
  onClose: () => void;
  addCompEntry: (n: CompEntry) => void;
}

const CompEntryDialog: React.FC<CompEntryDialogProps> = ({
  open,
  compEntry,
  onClose,
  addCompEntry,
}) => {
  // TODO: Data isn't loading into edit properly
  console.log(compEntry);
  const { month, year } = compEntry?.entryDate
    ? dateHelper(compEntry?.entryDate)
    : { month: 1, year: years[0] };
  const [entryDateMonth, setEntryDateMonth] = React.useState(month.toString());
  const [entryDateYear, setEntryDateYear] = React.useState(year.toString());
  const [salary, setSalary] = React.useState(compEntry?.salary || 0);
  const [bonus, setBonus] = React.useState(compEntry?.bonus || 0);
  const [priceNow, setPriceNow] = React.useState(compEntry?.priceNow || 0);
  const [priceThen, setPriceThen] = React.useState(compEntry?.priceThen || 0);
  const [grantDuration, setGrantDuration] = React.useState(
    compEntry?.grantDuration || 4,
  );
  const [grantQty, setGrantQty] = React.useState(compEntry?.grantQty || 0);

  const handleChange =
    (func: (n: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
      func(parseFloat(e.target.value));
  const handleSelectMonth = (e: SelectChangeEvent<string>) =>
    setEntryDateMonth(e.target.value);
  const handleSelectYear = (e: SelectChangeEvent<string>) =>
    setEntryDateYear(e.target.value);

  const handleSubmit = () => {
    addCompEntry({
      entryDate: `${entryDateYear}-${entryDateMonth.length < 2 ? "0" : ""}${entryDateMonth}`,
      salary,
      bonus,
      priceNow,
      priceThen,
      grantDuration,
      grantQty,
    });
    // reset state
    setEntryDateMonth("1");
    setEntryDateYear(years[0].toString());
    setSalary(0);
    setBonus(0);
    setPriceNow(0);
    setPriceThen(0);
    setGrantDuration(4);
    setGrantQty(0);
  };

  console.log(salary, bonus, priceNow, priceThen, grantDuration, grantQty);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Comp Entry</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex" }}>
          <FormControl fullWidth>
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              label="Month"
              value={entryDateMonth}
              onChange={handleSelectMonth}
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
            <Select
              labelId="year-select-label"
              id="year-select"
              label="Year"
              value={entryDateYear}
              onChange={handleSelectYear}
            >
              {years.map((year) => (
                <MenuItem value={year} key={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <TextField
          label="Salary"
          value={salary}
          onChange={handleChange(setSalary)}
          InputProps={{ startAdornment: "$" }}
          {...tfProps}
        />
        <TextField
          label="Bonus"
          value={bonus}
          onChange={handleChange(setBonus)}
          InputProps={{ startAdornment: "$" }}
          {...tfProps}
        />
        <DialogContentText variant="h6" component="h4" sx={{ marginTop: 7 }}>
          Stock
        </DialogContentText>
        <TextField
          label="Grant Quantity"
          value={grantQty}
          onChange={handleChange(setGrantQty)}
          {...tfProps}
        />
        <TextField
          label="Grant Duration"
          value={grantDuration}
          onChange={handleChange(setGrantDuration)}
          {...tfProps}
        />
        <TextField
          label="Grant Value Then"
          value={priceThen}
          onChange={handleChange(setPriceThen)}
          InputProps={{ startAdornment: "$" }}
          {...tfProps}
        />
        <TextField
          label="Grant Value Now"
          value={priceNow}
          onChange={handleChange(setPriceNow)}
          InputProps={{ startAdornment: "$" }}
          {...tfProps}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompEntryDialog;
